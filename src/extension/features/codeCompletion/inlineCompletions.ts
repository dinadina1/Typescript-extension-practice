import { ExtensionContext, InlineCompletionItemProvider, TextDocument, Position, InlineCompletionContext, InlineCompletionItem, CancellationToken, InlineCompletionList, languages, window } from 'vscode';
import axios from 'axios';

export function inlineAutoCompletion(context: ExtensionContext) {
    const provider: InlineCompletionItemProvider = {
        async provideInlineCompletionItems(
            document: TextDocument,
            position: Position,
            context: InlineCompletionContext,
            token: CancellationToken
        ): Promise<InlineCompletionList> {
            const linePrefix = document.lineAt(position.line).text.substring(0, position.character);

            const suggestions = await fetchSuggestions(linePrefix);
            if (!suggestions) {
                return { items: [] };
            } 
            const completionItems = suggestions.map((suggestion: any) => {
                const item = new InlineCompletionItem(suggestion);
                return item;
            });

            return { items: completionItems };
        }
    }

    context.subscriptions.push(
        languages.registerInlineCompletionItemProvider({ scheme: 'file', language: '*'}, provider)
    );
    window.showInformationMessage('Inline completion extension is started.');
};

async function fetchSuggestions(prefix: string): Promise<any> {
    try {
        const {data} = await axios.post('https://localhost:8000/inline');
        console.log(data);
        
        return data.response;
    } catch (error) {
        console.error('Error fetching suggestions:', error);
        return null;
    }
}