import {window, commands, ExtensionContext} from 'vscode';
import { registerCommands } from './extension/features/registerCommands';
import {registerWelcomeMessage} from './extension/features/registerWelcomeMessage';
import { registerIntelligence } from './extension/features/codeCompletion/registerIntelligence';
import { inlineAutoCompletion } from './extension/features/codeCompletion/inlineCompletions';

export function activate(context: ExtensionContext) {

	const op = window.createOutputChannel('TrialOutput'); // custom name

	registerCommands(context, op);
	registerWelcomeMessage(context);
	registerIntelligence(context);

	inlineAutoCompletion(context);

}

// This method is called when your extension is deactivated
export function deactivate() {}
