import { useState,useEffect } from "react";
import { Button } from "antd";

const Index: React.FC<any> = () => {
  const [state, setState] = useState({ number: 0 });
  let [count, setCount] = useState(0);

  // 数字形式
  useEffect(() => {
    // console.log("数字形式：", count);
    // setState({ number: state.number + 1 });
  }, []);

  const handleAdd = () => {
    state.number++;
    setState(state);
  };

  return (
    <div >
      <div>数字形式：{count}</div>
      <Button
        type="primary"
        onClick={() => {
          count++;
          setCount(count);
        }}
      >
        点击+1
      </Button>
      <div>对象形式：{state.number}</div>
      <Button
        type="primary"
        onClick={handleAdd}
      >
        点击+1
      </Button>
    </div>
  );
};

export default Index;