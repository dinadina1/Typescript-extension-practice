import {ExtensionContext, workspace, window} from 'vscode';

export function registerWelcomeMessage(content: ExtensionContext){
    const isEnabledWelcomMessage = workspace.getConfiguration().get<boolean>("trial.welcom.message.enabled");

    if(isEnabledWelcomMessage){
       let emoji = workspace.getConfiguration().get<string>("trial.welcom.message.emoji");
       let text = workspace.getConfiguration().get<string>("trial.welcom.message.string");

       text = text ?? "Welcome";
       emoji = emoji ?? "🎉";

       window.showInformationMessage(`${text} ${emoji}`);
    }
}