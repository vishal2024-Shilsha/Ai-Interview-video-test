// src/page/NotFound.jsx
import React from 'react';

function NotFound() {

    function ModifyingList(arr){
        let point=-1;
        let n=arr.length;
        for(let i=n-2;i>=0;i--){
            if(arr[i]<arr[i+1]){
                point=i;
                break;
            }
        }

        if(point==-1){
            return arr.sort((a,b) => b-a)
        }

        if(point !== -1){
            let temp=arr[point];
            arr[point]=arr[n-1];
            arr[n-1]=temp;
        }
        let backpoint=arr.length-1;
        while(point+1<backpoint){
            let temp=arr[point+1];
            arr[point+1]=arr[backpoint]
            arr[backpoint]=temp;
            point++;
            backpoint--
        }
        return arr
    }

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>404 - Page Not Found</h1>
      <p>Sorry, the page you are looking for doesn’t exist.</p>
    </div>
  );
}

export default NotFound;
