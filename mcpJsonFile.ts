export interface McpJsonFile {
    mcpServers: {
        [serverName: string]: McpJsonServer;
    };
}

export interface McpServerEntity {
    name: string; // user provided name - assume it's the official name rn, needs enrichment
    type: 'command' | 'sse';
    command?: string;
    args?: string[];
    url?: string;
    config: string; // command with args if command, url if sse
    storedCredentials: boolean;
    remote: boolean;
    category: string; // ENRICHMENT: category of the server, e.g. "communication", "development", "database", "tools", "other"
    official: boolean; // ENRICHMENT: true if the server is official, false if it is a 3rd party server
}

export type McpJsonServer = StdioConfig | SSEConfig

export interface BaseConfig {
    env?: {
        [key: string]: string | number | boolean;
    };
}

export interface StdioConfig extends BaseConfig {
    type: 'command';
    command: string;
    args: string[];
}


export interface SSEConfig extends BaseConfig {
    type: 'sse';
    url: string;
}

export const getServerTyped = (server: McpJsonServer): McpJsonServer => {
    const mutatedServer = { ...server };
    if ('command' in server && 'args' in server) {
        mutatedServer.type = 'command';
    }
    if ('url' in server) {
        mutatedServer.type = 'sse';
    }
    return mutatedServer;
};

export const getConfig = (server: McpJsonServer): string => {
    switch (server.type) {
        case 'command':
            return [server.command, ...(server.args)].join(' ');
        case 'sse':
            return server.url;
    }
};

export const isMcpRemote = (server: McpJsonServer): boolean => {
    if (server.type === 'sse') {
        return !/^(https?:\/\/(localhost|127\.0\.0\.1|host\.docker\.internal|0\.0\.0\.0|::1)(:|\/|$))/i.test(server.url);
    }
    return false;
};