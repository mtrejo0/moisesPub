   // types/stream-to-buffer.d.ts
   declare module 'stream-to-buffer' {
    import { Stream } from 'stream';

    function streamToBuffer(stream: Stream, callback: (err: Error | null, buffer: Buffer) => void): void;

    export = streamToBuffer;
  }