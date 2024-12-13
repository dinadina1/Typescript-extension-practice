// function to have register command functionality
import {commands, ExtensionContext, OutputChannel, window} from 'vscode';

export function registerCommands(context:ExtensionContext, op:OutputChannel) {
    
    // modal alert to get result from user
    context.subscriptions.push(commands.registerCommand('trial.dialog-modal-message', () => {
        window.showInformationMessage('This is a Dialog modal message example', {
            modal: true,
            detail: 'How many cats, do you see 🐈🐈🐈 in this message?'
        }, '1', '2', '3', '4').then((result) => evaluateUserSelection(result));
    }));

    // dropdown alert to get result from user
    context.subscriptions.push(commands.registerCommand('trial.ask-user', () => {
        window.showInformationMessage('How many cats, do you see 🐈🐈🐈 in this message?', '1', '2', '3', '4')
        .then(result => evaluateUserSelection(result));
    }));

    // print text in output channel
    context.subscriptions.push(commands.registerCommand('trial.print-explore-menu', () => {
        readSelectedOrAllText(op);
    }))
}

// function to evaluate user selection
function evaluateUserSelection(result: string | undefined) {
    if(! result){
        window.showInputBox({title: 'Please enter your answer here... 👇'})
        .then(result => evaluateUserSelection(result));
    } else if (result === '3'){
        window.showInformationMessage('Perfect 😸😸😸!');
    } else {
        window.showInformationMessage('Wrong 😸😸😸!');
    }
}

// read all text from the file if selected content
export function readSelectedOrAllText(op: OutputChannel){
    op.clear();
    const {activeTextEditor} = window;
    let text = '';

    if(!activeTextEditor || activeTextEditor.document.languageId !== 'javascript') {
        op.appendLine('no active found');
    } else {
        text = activeTextEditor.document.getText(activeTextEditor.selection);
        if(!text) activeTextEditor.document.getText();
        op.appendLine(text);
    }
    op.show();
    return text;
}