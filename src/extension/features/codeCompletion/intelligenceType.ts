import { CompletionItem } from "vscode";

export enum IntelligenceType {
    Class,
    Method,
    Property
};

export interface Intelligence {
    name: string,
    Doc: string,
    type: IntelligenceType,
    returnType?: string,
    child?: Array<Intelligence>
}