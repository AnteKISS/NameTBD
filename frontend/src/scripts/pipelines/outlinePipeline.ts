export class OutlinePipeline extends Phaser.Renderer.WebGL.Pipelines.MultiPipeline {
  
  public static readonly KEY = "Outline";

  constructor(game: Phaser.Game) {
    super({
      game: game,
      // renderer: game.renderer,
      fragShader: `
      precision mediump float;

      uniform sampler2D iChannel0; // Input texture

      uniform vec2 uTextureSize;
      
      void main()
      {
        // Sample the texture
        vec4 pixel = texture2D(iChannel0, gl_FragCoord.xy); // / vec2(800.0, 600.0)); // Assuming resolution is 800x600
    
        // Increase the alpha value of the pixel
        pixel.a *= 1.2; // Increase alpha by 20%
    
        // Output the modified color
        gl_FragColor = pixel;
      }
    `
      // fragShader: `
      //   precision mediump float;

      //   uniform sampler2D uMainSampler;
      //   uniform vec2 uTextureSize;

      //   varying vec2 outTexCoord;
      //   varying float outTintEffect;
      //   varying vec4 outTint;

      //   void main(void) 
      //   {
      //     vec4 texture = texture2D(uMainSampler, outTexCoord);
      //     vec4 texel = vec4(outTint.rgb * outTint.a, outTint.a);
      //     vec4 color = texture;

      //     if (outTintEffect == 0.0)
      //     {
      //       color = texture * texel;
      //     }
      //     else if (outTintEffect == 1.0)
      //     {
      //       color.rgb = mix(texture.rgb, outTint.rgb * outTint.a, texture.a);
      //       color.a = texture.a * texel.a;
      //     }
      //     else if (outTintEffect == 2.0)
      //     {
      //       color = texel;
      //     }

      //     vec2 onePixel = vec2(1.0, 1.0) / uTextureSize;
      //     float upAlpha = texture2D(uMainSampler, outTexCoord + vec2(0.0, onePixel.y)).a;
      //     float leftAlpha = texture2D(uMainSampler, outTexCoord + vec2(-onePixel.x, 0.0)).a;
      //     float downAlpha = texture2D(uMainSampler, outTexCoord + vec2(0.0, -onePixel.y)).a;
      //     float rightAlpha = texture2D(uMainSampler, outTexCoord + vec2(onePixel.x, 0.0)).a;

      //     if (texture.a == 0.0 && max(max(upAlpha, downAlpha), max(leftAlpha, rightAlpha)) == 1.0) 
      //     {
      //       color = vec4(1.0, 1.0, 1.0, 1.0);
      //     }

      //     gl_FragColor = color;
      //   }
      // `
    });
    this.renderer = game.renderer as Phaser.Renderer.WebGL.WebGLRenderer;
  }
}