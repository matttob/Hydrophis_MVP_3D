export default function Checkbox(isChecked,setIsChecked,checkBoxText) {
    const checkHandler = () => {
        setIsChecked(!isChecked)}
      return (
        <div>
          <input
            type="checkbox"
            id="checkbox"
            checked={isChecked}
            onChange={checkHandler}
          />
          <label htmlFor="checkbox" style={{ color: 'white' , fontFamily: 'Inter'}}> {checkBoxText} </label>
        </div>
      )
    }