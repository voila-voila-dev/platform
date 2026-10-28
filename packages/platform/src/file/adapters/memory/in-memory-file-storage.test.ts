import { inMemoryFileStorage } from "#file/adapters/memory/in-memory-file-storage";
import { fileStorageContract } from "#file/services/file-storage-service.test-helper";

fileStorageContract("inMemoryFileStorage", inMemoryFileStorage().layer);
