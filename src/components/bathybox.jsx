export default function bathyCheckbox(isChecked,setIsChecked) {
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
          <label htmlFor="checkbox" style={{ color: 'white' , fontFamily: 'Inter'}}> Bathymetry </label>
        </div>
      )
    }