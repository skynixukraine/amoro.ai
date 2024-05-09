import React, {useRef} from 'react';
import classes from './TextAreaComponent.module.css';
const signOffTokens = ['accFName', 'accLName'];
const signOffBottomTokens = ['userName', 'userEmailAddress'];

const TextAreaComponent: React.FC<{
  label: string;
  value: string;
  onChangeData: (value: any) => void;
  disabled?: boolean;
  isBottom?: boolean;
}> = ({ value, label, onChangeData, isBottom, disabled }) => {

  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const insertToken = (token: string) => {
    const textArea = textAreaRef.current;
    if (textArea) {
      const startPos = textArea.selectionStart;
      const endPos = textArea.selectionEnd;

      const text = textArea.value;
      const newText = text.substring(0, startPos) + token + text.substring(endPos, text.length);

      textArea.value = newText;

      // Move the cursor to the end of the inserted token
      textArea.selectionStart = startPos + token.length;
      textArea.selectionEnd = startPos + token.length;

      textArea.focus();

      onChangeData(newText)
    }
  };


  const signOffComponent = () => <ul className={classes.signoffTokens}>
    {(isBottom? signOffBottomTokens : signOffTokens).map((token) => <li onClick={() => insertToken(`{{${token}}}`)} style={{
      border: '1px solid #0f6937',
      padding: '5px 10px',
      fontSize: '12px',
      borderRadius: '5px',
      cursor: 'pointer'
    }} key={token}>{`{{${token}}}`}</li>)}
  </ul>

const superscripts = ['1', '2', '3'];
const superscriptComponent = () => <ul className={classes.signoffTokens}>
  {superscripts.map((superscript) => <li onClick={() => insertToken(`[${superscript}]`)} 
  className={classes.superscript}  
 key={superscript}>{superscript}</li>)}
</ul>

  return (
    <>
      <div className={classes.signoffComponent}>
        <label style={{ fontWeight: 500 }}>{label}</label>
        <div className={classes.signoffComponentTokens}>Insert salutation tokens: {signOffComponent()}</div>
      </div>
      <textarea
        className={classes.textarea}
        ref={textAreaRef}
        rows={3}
        value={value}
        disabled={disabled}
        onChange={(e) =>
          onChangeData(e.target.value)
        }
      />
       <div className={classes.superscriptBottom}> Insert superscript: {superscriptComponent()}</div>
    </>
  );
};

export default TextAreaComponent;
