import React,{ useState } from 'react';
import { Button } from 'antd';
const Hoc = (Components:any) =>(props:any) => {
   return (
    <Components name={"大家好"} {...props} ></Components>
   )
};

const Index: React.FC<any>  = (props:any) => {
  const [count, setCount] = useState(false);
  const handleClick = () => {
    setCount(true)
  };
  return (
    <div>
      <Button onClick={handleClick}>点击</Button>
      {count && JSON.stringify(props)}
    </div>
  );
}

export default Hoc(Index);
