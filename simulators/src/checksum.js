export default function(data) {
    let b = 0;
    let j = data.buffer.byteLength;

    for (let i = 0;i < j; i++)
    {
      b = data[i] + b & 0xff;
    }  
    return b;
}