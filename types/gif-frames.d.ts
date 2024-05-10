   // types/gif-frames.d.ts
   declare module 'gif-frames' {
    interface GifFramesOptions {
      url: Buffer;
      frames: number | 'all';
      outputType: 'jpg' | 'png' | 'gif';
      quality?: number;
      cumulative?: boolean;
    }

    function gifFrames(options: GifFramesOptions): Promise<any>;

    export = gifFrames;
  }