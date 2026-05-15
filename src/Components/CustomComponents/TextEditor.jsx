import JoditEditor from 'jodit-react';

const buttons = [
//   'undo',
//   'redo',
//   '|',
  'bold',
//   'strikethrough',
  'underline',
  'italic',
  '|',
  'superscript',
  'subscript',
  '|',
  'align',
  '|',
  'ul',
  'ol',
//   'outdent',
//   'indent',
  '|',
  'font',
//   'fontsize',
  'brush',
  'paragraph',
  '|',
  'image',
//   'video',
//   'link',
  'table',
  '|',
//   'hr',
//   'eraser',
//   'copyformat',
//   '|',
//   'selectall',
//   'print',
//   '|',
//   'source',
//   '|',
  {
    name: 'insertMergeField',
    tooltip: 'Insert Merge Field',
    // iconURL: 'images/merge.png',
    popup: (editor, current, self, close) => {
      function onSelected(e) {
        let mergeField = e.target.value;
        if (mergeField) {
          // console.log(mergeField);
          editor.selection.insertNode(
            editor.create.inside.fromHTML('{{' + mergeField + '}}'),
          );
        }
      }
      let divElement = editor.create.div('merge-field-popup');

      let labelElement = document.createElement('label');
      labelElement.setAttribute('class', 'merge-field-label');
      labelElement.text = 'Merge field: ';
      divElement.appendChild(labelElement);

      let selectElement = document.createElement('select');
      selectElement.setAttribute('class', 'merge-field-select');
      selectElement.appendChild(
        createOptionGroupElement(facilityMergeFields, 'Facility'),
      );
      selectElement.appendChild(
        createOptionGroupElement(inspectionMergeFields, 'Inspection'),
      );
      selectElement.onchange = onSelected;
      divElement.appendChild(selectElement);

      // console.log(divElement);
      return divElement;
    },
  },

];

const editorConfig = {
  readonly: false,
  toolbar: true,
  spellcheck: true,
  language: 'en',
  toolbarButtonSize: 'medium',
  toolbarAdaptive: false,
  showCharsCounter: true,
  showWordsCounter: true,
  showXPathInStatusbar: false,
  askBeforePasteHTML: true,
  askBeforePasteFromWord: true,
  placeholder: 'Type description',
  buttons: buttons,
  uploader: {
    insertImageAsBase64URI: true,
  },
};

export const TextEditor = ({setDescription, description}) => {
//   const [data, setData] = useState();

//   console.log(data, 'data');
console.log(description,'description');
  return (
    <>
      <JoditEditor
        // value={data}
        value={description}
        config={editorConfig}
        // onChange={(value) => setData(value)}
        onChange={(value) => setDescription(value)}
        style={{ maxHeight: '300px' }}
      />
    </>
  );
};
