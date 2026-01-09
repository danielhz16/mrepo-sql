import { BaseRepository } from "./dist/index.js";

/**
 * This is a sample JS file to verify autocomplete.
 * If you hover over BaseRepository or its methods, you should see full documentation.
 */

const repo = new BaseRepository({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'test'
});

// Try typing 'repo.execSP(' and observe the parameter hints!
// repo.execSP('sp_test', { params: ... });
