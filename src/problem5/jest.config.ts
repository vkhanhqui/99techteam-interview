import type { Config } from "jest";
import dotenv from "dotenv";

dotenv.config({ path: ".env" });

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/__tests__/**/*.int.test.ts", "**/?(*.)+(spec|test).ts"],
  moduleFileExtensions: ["ts", "js", "json"],
  roots: ["<rootDir>/services", "<rootDir>/__tests__"],
};

export default config;
