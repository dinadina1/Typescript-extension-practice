import { CompletionItem, languages, ExtensionContext, TextDocument, Position, CompletionItemKind } from "vscode";
import { intelligencePayload } from "./intelligenceData";
import { IntelligenceType, Intelligence } from "./intelligenceType";

const insideBracketRegxPattern = new RegExp(/(?<=\().+?(?=\))/gi);
const spaceRegxPattern = new RegExp(/\s/gi);


export function registerIntelligence(context: ExtensionContext) {
    context.subscriptions.push(loadInterfaces(getClasses(intelligencePayload)));
    const map = getIntelligence(intelligencePayload);
    registerCommands(map);
}

function loadInterfaces(items: Array<CompletionItem>) {
    const regex = new RegExp(/[.\)]$/);

    return languages.registerCompletionItemProvider(
        "javascript", {
        provideCompletionItems(document: TextDocument, position: Position) {
            const linePrefix = document.lineAt(position).text.substring(0, position.character);
            if (regex.test(linePrefix.trim())) {
                return undefined;
            }
            return items;
        }
    }
    )
};

function registerCommands(map: Map<string, CompletionItem[]>) {
    return languages.registerCompletionItemProvider(
        "javascript",{
            provideCompletionItems(document: TextDocument, position: Position) {
                const linePrefix = document.lineAt(position).text.substring(0, position.character);
                if(!linePrefix.endsWith('.')) return;
                const key = getKey(linePrefix);
                if(!map.has(key)) return;
                return map.get(key);
            }
        }, "."
    )
};

function getKey(key: string) {
    return key.replace(insideBracketRegxPattern, '').replace(spaceRegxPattern, '');
}

function getClasses(intelligencePayload: Array<Intelligence>) {
    const commands = new Array<CompletionItem>();
    intelligencePayload.forEach(element => {
        const c = new CompletionItem(element.name, CompletionItemKind.Class);
        c.detail = element.Doc;
        c.insertText = element.name;
        commands.push(c);
    });
    return commands;
}

function getIntelligence(intelligencePayload: Array<Intelligence>) {
    const map = new Map<string, CompletionItem[]>();
    intelligencePayload.forEach(element => {
        map.set(getKey(element.name) + ".", getCompletionItems(element.name, element, map));
    });
    return map;
}

function getCompletionItems(parentKey: string, intelligencePayload: Intelligence, map: Map<string, CompletionItem[]>) {
    const commands = new Array<CompletionItem>();
    intelligencePayload.child?.forEach(element => {
        const key = `${parentKey}.${element.name}`;
        map.set(getKey(key) + ".", getCompletionItems(key, element, map));
        const c = new CompletionItem(element.name, element.type == IntelligenceType.Method ? CompletionItemKind.Method : CompletionItemKind.Property);
        c.detail = element.returnType ?? element.Doc;
        c.documentation = element.Doc;
        c.insertText = element.name;
        commands.push(c);
    });

    return commands;
}