
import React, { useState, useEffect} from "react";

import { message ,Button,Input } from "antd";
const count = 20000;

const Index: React.FC<any>  = (props:any) => {
    const [list,setList] = useState<String[]>([]);
    // return (
    //     <div>
    //        <Input onChange={(event) => {
    //             startTransition(() => { 
    //             const value = [];
    //             for(let i = 0; i < count; i++) {
    //                 value.push(event.target.value);
    //             }
    //             setList(value);
    //             })
    //        }}></Input> 
    //        {isPending ? <div>loading...</div> : <div>
    //         {
    //             list.map((item,index) => {
    //                 return <div key={index}>{item}</div>
    //             })
    //         }
    //         </div>}
    //     </div>
    // )
}
// 在Vue3中，由于响应式系统的特性， count.value 总是能获取到最新值，不会有React中的闭包陷阱问题。
const Pratice = () => {
    const [nums, setNums] = useState<number>(0);
    const [times,setTimes] = useState<Number|string>('');

    useEffect(() => {
        message.info("组件加载了" );
        const interval = setInterval(() => {
            console.log("useEffect",nums);
            setNums(nums + 1);
            // 使用函数式更新，不依赖闭包中的count值，也可以实现实时更新
            //     setNums(prevCount => {
            //     console.log("count:", prevCount);
            //     return prevCount + 1;
            //   });
        }, 1000);
        return () => {
            message.info("组件卸载了");
            // 组件卸载时清除定时器
            clearInterval(interval);
        }
    }, []);
    // ps:在当前useEffect中 ，直接在最后的[]中加上nums（[nums]）也是可以实现实时更新的 ，但是这样做会导致useEffect会无限循环执行，当你在依赖数组中添加 count 时，每当 count 值变化，整个 useEffect 回调都会重新执行。这意味着：
    // 1. 旧的定时器会被清除（通过返回的清理函数）
    // 2. 新的定时器会被创建，并捕获最新的 count 值

    return (
        <div>
         <p><Button type="primary" onClick={() => {setTimes(Date.now())}} ></Button> 当前的time值是：{times}</p>
         当前num的值是：{nums}
        </div>
    )
}

export default Pratice;


// import { useCallback, useState } from "react";
// import type { Dispatch, SetStateAction } from "react";
// import useUnmountedRef from "../useUnmountedRef";

// function useSafeState<S>(initialState: S | (() => S)): [S, Dispatch<SetStateAction<S>>];
// function useSafeState<S = undefined>(): [
//   S | undefined,
//   Dispatch<SetStateAction<S | undefined>>
// ];
// function useSafeState<S>(initialState?: S | (() => S)) {
//   const unmountedRef: { current: boolean } = useUnmountedRef();
//   const [state, setState] = useState(initialState);
//   const setCurrentState = useCallback((currentState: any) => {
//     if (unmountedRef.current) return;
//     setState(currentState);
//   }, []);

//   return [state, setCurrentState] as const;
// }
// export default useSafeState;