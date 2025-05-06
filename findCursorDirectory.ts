import * as fs from 'fs/promises';
import * as path from 'path';
import * as os from 'os';

/**
 * Searches for all directories named '.cursor' starting from a specified path
 * 
 * @param startPath - The directory to start searching from (defaults to user's home directory)
 * @param maxDepth - Maximum directory depth to search (to prevent infinite recursion)
 * @returns Promise resolving to an array of paths to all .cursor directories found
 */
export const findCursorDirectories = async (
  startPath: string = os.homedir(), 
  maxDepth: number = 10
): Promise<string[]> => {
  // Results array to collect all found .cursor directories
  const results: string[] = [];

  // Helper function to search recursively
  const searchDirectory = async (currentPath: string, depth: number): Promise<void> => {
    // Base case: prevent excessive recursion
    if (depth <= 0) {
      return;
    }

    try {
      // Get all entries in the current directory
      const entries = await fs.readdir(currentPath, { withFileTypes: true });
      
      // Look for .cursor directory in current directory
      const cursorDir = entries.find(entry => 
        entry.isDirectory() && entry.name === '.cursor'
      );
      
      // If found, add to results
      if (cursorDir) {
        results.push(path.join(currentPath, '.cursor'));
      }
      
      // Search recursively in all subdirectories
      for (const entry of entries) {
        if (entry.isDirectory() && !entry.name.startsWith('.')) {
          const subDirPath = path.join(currentPath, entry.name);
          await searchDirectory(subDirPath, depth - 1);
        }
      }
    } catch (error: any) {
      // Check if this is a permission error (EPERM)
      if (error.code === 'EPERM') {
        // Log permission errors as debug only
        // console.debug(`Permission denied when accessing ${currentPath}: ${error.message}`);
      } else {
        // Log other errors normally
        console.error(`Error searching in ${currentPath}:`, error);
      }
    }
  };

  // Start the recursive search
  await searchDirectory(startPath, maxDepth);
  return results;
};

// Example usage
const main = async (): Promise<void> => {
  console.log('Searching for .cursor directories...');
  const cursorDirPaths = await findCursorDirectories();
  
  if (cursorDirPaths.length > 0) {
    console.log(`Found ${cursorDirPaths.length} .cursor directories:`);
    cursorDirPaths.forEach((path, index) => {
      console.log(`${index + 1}. ${path}`);
    });
  } else {
    console.log('No .cursor directories found');
  }
};

// Run the example if this file is executed directly
if (require.main === module) {
  main().catch(console.error);
} 