'use babel';

import CsCppGenView from './cs-cpp-gen-view';
import { CompositeDisposable } from 'atom';

export default {

  csCppGenView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    this.csCppGenView = new CsCppGenView(state.csCppGenViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.csCppGenView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view

    this.subscriptions.add(atom.commands.add('atom-workspace', {
        'cs-cpp-gen:create-header-comment': () => {
            te = atom.workspace.getActiveTextEditor();
            this.headerComment(te);
        }
    }));

    this.subscriptions.add(atom.commands.add('atom-workspace', {
        'cs-cpp-gen:create-main-skeleton': () => {
            te = atom.workspace.getActiveTextEditor();
            this.mainFileTemplate(te);
        }
    }));

    this.subscriptions.add(atom.commands.add('atom-workspace', {
        'cs-cpp-gen:create-header-skeleton': () => {
            te = atom.workspace.getActiveTextEditor();
            this.headerFileCreate(te);
        }
    }));
  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.csCppGenView.destroy();
  },

  serialize() {
    return {
      csCppGenViewState: this.csCppGenView.serialize()
    };
  },

  toggle() {
    console.log('CsCppGen was toggled!');
    return (
      this.modalPanel.isVisible() ?
      this.modalPanel.hide() :
      this.modalPanel.show()
    );
  },

  headerComment(editor) {
      var filename = editor.getFileName();
      if(filename.endsWith('.cpp') || filename.endsWith('.h')) {
          var cmt = "\
/**\n\
 * @file $file$\n\
 *\n\
 * @brief\n\
 *\n\
 * @author Jonathan Weatherspoon\n\
 *\n\
 * @version 0.10\n\
 *          Initial commit\n\
 *\n\
 * @Note\n\
 *\n\
 */\n\
";
          editor.insertText(cmt.replace(/\$file\$/g, filename));

      }
  },

  mainFileTemplate(editor) {
      var filename = editor.getFileName();
      if(filename.endsWith('.cpp')) {
          this.headerComment(editor);
          var skeleton = "\n\n\
#include <iostream>\n\n\
//FUNCTION PROTOTYPES\n\n\n\
//MAIN FUNCTION: Entry point of the application.\n\
int main(int argc, char **argv) {\n\
\n\treturn 0;\n\
}\
";
          editor.insertText(skeleton);
      }
  },

  includeGuardGen(filename) {
      return filename.toUpperCase().replace(/\W/g, '_');
  },

  headerFileCreate(editor) {
      var filename = editor.getFileName();
      if(filename.endsWith('.h')) {
          this.headerComment(editor);
          var skeleton = "\n\n\
#ifndef $INC_GUARD$\n\
#define $INC_GUARD$\n\n\n\n\
#endif\
";
          editor.insertText(skeleton.replace(/\$INC_GUARD\$/g, this.includeGuardGen(filename)));
      }
  }
};
