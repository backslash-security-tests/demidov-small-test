import * as fs from 'fs/promises'
import * as os from 'os'
import * as path from 'path'
import { McpJsonFile, McpServerEntity, getConfig, getServerTyped, isMcpRemote } from './mcpJsonFile'
import initSqlJs, { QueryExecResult, SqlValue } from 'sql.js'
import { CursorVscdbConfig, VscdbQueryResult, VscdbScanResult } from './vscdbScan'

/**
 * Searches for all directories named '.cursor' starting from a specified path
 * 
 * @param startPath - The directory to start searching from (defaults to user's home directory)
 * @param maxDepth - Maximum directory depth to search (to prevent infinite recursion)
 * @returns Promise resolving to an array of paths to all .cursor directories found
 */
export const findCursorDirectories = async (
  startPath: string = os.homedir(),
  maxDepth: number = 20
): Promise<string[]> => {
  // Results array to collect all found .cursor directories
  const results: string[] = []

  // Helper function to search recursively
  const searchDirectory = async (currentPath: string, depth: number): Promise<void> => {
    // Base case: prevent excessive recursion
    if (depth <= 0) {
      return
    }

    try {
      // Get all entries in the current directory
      const entries = await fs.readdir(currentPath, { withFileTypes: true })

      // Look for .cursor directory in current directory
      const cursorDir = entries.find(entry =>
        entry.isDirectory() && entry.name === '.cursor'
      )

      // If found, add to results
      if (cursorDir) {
        results.push(path.join(currentPath, '.cursor'))
      }

      // Search recursively in all subdirectories
      for (const entry of entries) {
        if (entry.isDirectory() && !entry.name.startsWith('.')) {
          const subDirPath = path.join(currentPath, entry.name)
          await searchDirectory(subDirPath, depth - 1)
        }
      }
    } catch (error: any) {
      // Check if this is a permission error (EPERM)
      if (error.code === 'EPERM') {
        // Log permission errors as debug only
        // console.debug(`Permission denied when accessing ${currentPath}: ${error.message}`);
      } else {
        // Log other errors normally
        console.error(`Error searching in ${currentPath}:`, error)
      }
    }
  }

  // Start the recursive search
  await searchDirectory(startPath, maxDepth)
  return results
}

/**
 * Finds the path to 'mcp.json' inside a given .cursor directory
 * @param cursorDirPath - Path to the .cursor directory
 * @returns Promise resolving to the path of mcp.json if it exists, otherwise null
 */
export const findMcpJsonInCursorDir = async (cursorDirPath: string): Promise<string | null> => {
  const mcpJsonPath = path.join(cursorDirPath, 'mcp.json')
  try {
    const stat = await fs.stat(mcpJsonPath)
    if (stat.isFile()) {
      return mcpJsonPath
    }
  } catch (error) {
    // File does not exist or is not accessible
  }
  return null
}

/**
 * Finds all files named 'state.vscdb' that have 'Cursor' in their folder path
 * @param startPath - The directory to start searching from (defaults to user's home directory)
 * @param maxDepth - Maximum directory depth to search (to prevent infinite recursion)
 * @returns Promise resolving to an array of paths to all matching state.vscdb files
 */
export const findCursorStateVscdbFiles = async (
  startPath: string = os.homedir(),
  maxDepth: number = 20
): Promise<string[]> => {
  const results: string[] = []

  const searchDirectory = async (currentPath: string, depth: number): Promise<void> => {
    if (depth <= 0) {
      return
    }
    try {
      const entries = await fs.readdir(currentPath, { withFileTypes: true })
      for (const entry of entries) {
        const entryPath = path.join(currentPath, entry.name)
        if (entry.isDirectory()) {
          await searchDirectory(entryPath, depth - 1)
        } else if (
          entry.isFile() &&
          entry.name === 'state.vscdb' &&
          entryPath.split(path.sep).some(segment => segment === 'Cursor') &&
          path.basename(path.dirname(entryPath)) === 'globalStorage'
        ) {
          results.push(entryPath)
        }
      }
    } catch (error: any) {
      // Check if this is a permission error (EPERM)
      if (error.code === 'EPERM') {
        // Log permission errors as debug only
        // console.debug(`Permission denied when accessing ${currentPath}: ${error.message}`);
      } else {
        // Log other errors normally
        console.error(`Error searching in ${currentPath}:`, error)
      }
    }
  }

  await searchDirectory(startPath, maxDepth)
  return results
}

// Example usage
const fileDirectoryScan = async () => {
  console.log('Searching for .cursor directories...')
  const cursorDirPaths = await findCursorDirectories()

  if (cursorDirPaths.length > 0) {
    console.log(`Found ${cursorDirPaths.length} .cursor directories:`)
    cursorDirPaths.forEach((path, index) => {
      console.log(`${index + 1}. ${path}`)
    })
    // After finding .cursor directories, look for mcp.json in each
    for (const dir of cursorDirPaths) {
      const mcpJsonPath = await findMcpJsonInCursorDir(dir)
      if (mcpJsonPath) {
        try {
          const mcpJsonContent = await fs.readFile(mcpJsonPath, 'utf-8')
          const mcpJson = JSON.parse(mcpJsonContent) as McpJsonFile
          if (!mcpJson.hasOwnProperty('mcpServers') || typeof mcpJson.mcpServers !== 'object') {
            console.error(`Error: 'mcpServers' key not found or invalid in ${mcpJsonPath}`)
            continue
          }

          const mcpServerObjects = Object.entries(mcpJson.mcpServers).map(([serverName, server]): McpServerEntity => {
            const serverTyped = getServerTyped(server)

            const config = getConfig(serverTyped)
            const storedCredentials = serverTyped.env ? Object.keys(serverTyped.env).length > 0 : false
            const remote = isMcpRemote(serverTyped)

            return {
              name: serverName,
              type: serverTyped.type,
              command: serverTyped.type === 'command' ? serverTyped.command : undefined,
              args: serverTyped.type === 'command' ? serverTyped.args : undefined,
              url: serverTyped.type === 'sse' ? serverTyped.url : undefined,
              config,
              storedCredentials,
              remote,
              category: 'other',
              official: false
            }
          })

          console.log(`MCP server objects in ${mcpJsonPath}:`, mcpServerObjects)
          return mcpServerObjects
        } catch (err) {
          console.error(`Failed to read or parse ${mcpJsonPath}:`, err)
        }
      } else {
        console.log(`No mcp.json found in: ${dir}`)
      }
    }
  } else {
    console.log('No .cursor directories found')
  }
}

const queryVscdb = async (filePath: string, query: string): Promise<VscdbQueryResult[]> => {
  const SQL = await initSqlJs()
  const fileBuffer = await fs.readFile(filePath)
  const db = new SQL.Database(new Uint8Array(fileBuffer))
  const result = db.exec(query)
  
  db.close()

  const rows = result[0].values.map(value => ({ key: value[0] as string, value: value[1] as string }))
  return rows
}

const getGlobalRule = (rows: VscdbQueryResult[]) => {
  return rows.find(row => row.key === 'aicontext.personalContext')?.value
}

const getUserConfig = (rows: VscdbQueryResult[]) => {
  return rows.find(row => row.key === 'src.vs.platform.reactivestorage.browser.reactiveStorageServiceImpl.persistentStorage.applicationUser')?.value
}

const assertUserConfigSchema = (userConfig: string | undefined) => {
const userConfigJson = userConfig ? JSON.parse(userConfig) as CursorVscdbConfig : undefined
  if (userConfigJson
    && 'availableDefaultModels2' in userConfigJson
    && 'aiSettings' in userConfigJson
    && 'modelOverrideEnabled' in userConfigJson.aiSettings
    && 'modelOverrideDisabled' in userConfigJson.aiSettings) {
    return userConfigJson
  }
  return undefined
}

const getEnabledModels = (userConfigJson: CursorVscdbConfig) => {
  const { availableDefaultModels2, aiSettings } = userConfigJson
  const { modelOverrideEnabled, modelOverrideDisabled } = aiSettings

  return [...new Set([
    ...availableDefaultModels2
      .filter(model => model.defaultOn)
      .filter(model => !modelOverrideDisabled.includes(model.name))
      .map(model => model.name),
    ...modelOverrideEnabled
  ])]
}


const stateVscdbScan = async () => {
  const stateVscdbFiles = await findCursorStateVscdbFiles()

  if (stateVscdbFiles.length > 0) {
    console.log(`Found ${stateVscdbFiles.length} cursor related state.vscdb files:`)
    for (const filePath of stateVscdbFiles) {
      console.log(`${filePath}`)
      try {
        const query = `SELECT key, value 
          FROM ItemTable 
          WHERE key in (
            'aicontext.personalContext', 
            'src.vs.platform.reactivestorage.browser.reactiveStorageServiceImpl.persistentStorage.applicationUser'
          );`
        const rows = await queryVscdb(filePath, query)

        const globalRule = getGlobalRule(rows)

        const userConfig = getUserConfig(rows)
        const userConfigJson = assertUserConfigSchema(userConfig)
        if (userConfigJson) {
          const enabledModels = getEnabledModels(userConfigJson)

          return {
            enabledModels,
            globalRule: globalRule ?? ''
          }
        }
      }
      catch (err) {
        console.error(`Failed to query ${filePath}:`, err)
      }
    }
  } else {
    console.log('No cursor related state.vscdb files found')
  }
}

// Run the example if this file is executed directly
if (require.main === module) {
  // fileDirectoryScan().catch(console.error)
  stateVscdbScan().then((values) => {
    if(values) {
      const { enabledModels, globalRule } = values
      console.log({enabledModels})
      console.log({globalRule})
    }
  })
} 
 