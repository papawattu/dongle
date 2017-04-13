export default function(data) {
    let b = 0;
    const j = data.buffer.byteLength;

    for (let i = 0;i < j; i++)
    {
      b = data[i] + b & 0xff;
    }  
    return b;
}
