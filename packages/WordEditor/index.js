import WordEditor from "./src/WordEditor";
WordEditor.install = Vue => {
  Vue.component(WordEditor.name, WordEditor);
}
export default WordEditor;