import React from 'react';
import Chip8Interpreter from './chip8_interpreter';

import Invaders from './invaders';

const SCREEN_WIDTH = 64;
const SCREEN_HEIGHT = 32;

interface Chip8ComponentProps {
    style?: React.CSSProperties
}

export default class Chip8Component extends React.Component<Chip8ComponentProps> {
    _chip8: Chip8Interpreter;
    _raf: number;
    _canvas: React.RefObject<HTMLCanvasElement>;

    _scale_factor: number;
    _throttle: number;
    _raf_counter: number;

    _key_map: number[];

    constructor(props: Chip8ComponentProps) {
        super(props)
        this._chip8 = new Chip8Interpreter();
        this._chip8.load(Invaders);
        this._canvas = React.createRef();
        this._scale_factor = 4;
        this._throttle = 0;
        this._raf_counter = 0;

        this._key_map = [
            49, 50, 51, 52,
            81, 87, 69, 82,
            65, 83, 68, 70,
            90, 88, 67, 86
        ];
    }

    onKeyDownHandler(e: KeyboardEvent): void {
        console.log("down")
        const key = e.keyCode;
        for (let i = 0; i < this._key_map.length; ++i) {
            if (key == this._key_map[i]) {
                this._chip8.set_key(i);
                return;
            }
        }
    }

    onKeyUpHandler(e: KeyboardEvent): void {
        console.log("up")
        const key = e.keyCode;
        for (let i = 0; i < this._key_map.length; ++i) {
            if (key == this._key_map[i]) {
                this._chip8.unset_key(i);
                return;
            }
        }
    }

    emulationLoop(): void {
        if (this._throttle == 0 || this._raf_counter % this._throttle == 0) {
            this._raf_counter = 0;
            this._chip8.cycle();

            if (this._chip8.draw_flag) {
                this._chip8.draw_flag = false;

                let black = '#ffffff';
                let white = '#000000';

                let ctx = this._canvas.current.getContext("2d");

                for (let i = 0; i < (64 * 32); i++) { 
                    let x = i % 64;
                    let y = Math.floor(i / 64);

                    this._chip8.gfx[i] > 0 
                        ? 
                        ctx.fillStyle = black :
                        ctx.fillStyle = white;
                    
                    x = x * this._scale_factor;
                    y = y * this._scale_factor;
                    const length = this._scale_factor;
                    ctx.fillRect(x, y, length, length);
                }
            }
        }

        this._raf_counter++;        
        this._raf = window.requestAnimationFrame(this.emulationLoop.bind(this));
    }

    componentDidMount() {
        this._canvas.current.onkeydown = this.onKeyDownHandler.bind(this);
        this._canvas.current.onkeyup = this.onKeyUpHandler.bind(this);

        this._raf = window.requestAnimationFrame(this.emulationLoop.bind(this));
    }

    componentWillUnmount() {
        window.cancelAnimationFrame(this._raf);
    }

    render() {
        const width = SCREEN_WIDTH * this._scale_factor;
        const height = SCREEN_HEIGHT * this._scale_factor;

        return (
            <div style={this.props.style}>
                <canvas
                    ref={this._canvas} 
                    width={width} 
                    height={height}
                    style={{width:`${width}px`, height:`${height}px`}} 
                    tabIndex={0}
                />
            </div>
        )
    }
}