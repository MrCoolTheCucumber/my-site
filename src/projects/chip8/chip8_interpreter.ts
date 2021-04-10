export default class Chip8Interpreter {
    _opcode: number;
    
    // memory map:
    // 0x000 - 0x1FF : Chip 8 interpreter
    // 0x050 - 0x0A0 : storage for font set 4x5 pixels
    // 0x200 - 0xFFF : ROM and work RAM
    _memory: Uint8Array; // ubyte

    _V: Uint8Array; // ubyte
    _I: number;
    _program_counter: number;

    _stack: Uint16Array; // ushort
    _stack_ptr: number;

    _delay_timer: number;
    _sound_timer: number;

    _await_key_press: boolean;
    _await_key_press_register: number;

    gfx: Uint8Array; // ubyte
    _key: boolean[];

    draw_flag: boolean;

    _fontset: Uint8Array = Uint8Array.from([
        0xF0, 0x90, 0x90, 0x90, 0xF0, // 0
        0x20, 0x60, 0x20, 0x20, 0x70, // 1
        0xF0, 0x10, 0xF0, 0x80, 0xF0, // 2
        0xF0, 0x10, 0xF0, 0x10, 0xF0, // 3
        0x90, 0x90, 0xF0, 0x10, 0x10, // 4
        0xF0, 0x80, 0xF0, 0x10, 0xF0, // 5
        0xF0, 0x80, 0xF0, 0x90, 0xF0, // 6
        0xF0, 0x10, 0x20, 0x40, 0x40, // 7
        0xF0, 0x90, 0xF0, 0x90, 0xF0, // 8
        0xF0, 0x90, 0xF0, 0x10, 0xF0, // 9
        0xF0, 0x90, 0xF0, 0x90, 0x90, // A
        0xE0, 0x90, 0xE0, 0x90, 0xE0, // B
        0xF0, 0x80, 0x80, 0x80, 0xF0, // C
        0xE0, 0x90, 0x90, 0x90, 0xE0, // D
        0xF0, 0x80, 0xF0, 0x80, 0xF0, // E
        0xF0, 0x80, 0xF0, 0x80, 0x80  // F
    ]);

    constructor() {
        this._opcode = 0;
        this._I = 0;
        this._program_counter = 0x200;
        this._stack_ptr = 0;
        this._delay_timer = 0;
        this._sound_timer = 0;

        this._memory = new Uint8Array(4096);
        this._V = new Uint8Array(16);
        this.gfx = new Uint8Array(64 * 32);
        this._stack = new Uint16Array(16);
        this._key = [];

        for (let i = 0; i < 16; ++i) {
            this._key.push(false);
        }

        for (let i = 0; i < 80; ++i) {
            this._memory[i] = this._fontset[i];
        }

        this.draw_flag = true;
    }

    load(rom: Uint8Array): void {
        // for now hardcode invaders?
        for (let i = 0; i < rom.length; ++i) {
            this._memory[0x200 + i] = rom[i];
        }
    }

    set_key(key_index: number): void {
        this._key[key_index] = true;

        if (this._await_key_press) {
            this._V[this._await_key_press_register] = key_index;
            this._await_key_press = false;
        }
    }

    unset_key(key_index: number): void {
        this._key[key_index] = false;
    }

    cycle(): void {
        if (this._await_key_press)
            return;

        this._opcode = (this._memory[this._program_counter] << 8) | this._memory[this._program_counter + 1];

        switch(this._opcode & 0xF000) {
            case 0x0000:
                switch (this._opcode & 0x000F) {
                    case 0x0000: // 0x00E0: clear screen
                        for (let i = 0; i < this.gfx.length; ++i)
                            this.gfx[i] = 0;
                        this.draw_flag = true;
                        this._program_counter += 2;
                        break;

                    case 0x000E: // 0x00EE: return from subroutine
                        this._program_counter = this._stack[this._stack_ptr];
                        this._stack_ptr--;
                        break;

                    default:
                        throw "Unknown this._opcode (0x0): " + this._opcode
                }
                break;

            case 0x1000: // 1nnn: JP addr
                this._program_counter = (this._opcode & 0x0FFF);
                break;

            case 0x2000: // 2nnn: CALL addr
                this._stack_ptr++;

                // put return addr in the stack
                // add 2 so we store the next instruction, otherwise we will cause an infinite loop!
                this._stack[this._stack_ptr] = this._program_counter + 2; 

                this._program_counter = (this._opcode & 0x0FFF);
                break;

            case 0x3000: // 3xkk: skip next instruction if Vx = kk
                if (this._V[(this._opcode & 0x0F00) >> 8] == (this._opcode & 0x00FF))
                    this._program_counter += 4;
                else
                    this._program_counter += 2;
                break;

            case 0x4000: // 4xkk: skip next instr if Vx != kk
                if (this._V[(this._opcode & 0x0F00) >> 8] != (this._opcode & 0x00FF))
                    this._program_counter += 4;
                else
                    this._program_counter += 2;
                break;

            case 0x5000: // 5xy0: skip next instr if Vx == Vy
                if (this._V[(this._opcode & 0x0F00) >> 8] == this._V[(this._opcode & 0x00F0) >> 4])
                    this._program_counter += 4;
                else
                    this._program_counter += 2;
                break;

            case 0x6000: // 6xkk: put kk into Vx
                this._V[(this._opcode & 0x0F00) >> 8] = (this._opcode & 0x00FF);
                this._program_counter += 2;
                break;

            case 0x7000: // 7xkk: add kk to Vx
                this._V[(this._opcode & 0x0F00) >> 8] += (this._opcode & 0x00FF);
                this._program_counter += 2;
                break;

            case 0x8000:
                switch (this._opcode & 0x000F) {
                    case 0x0: // 8xy0: Set Vx to val of Vy
                        this._V[(this._opcode & 0x0F00) >> 8] = this._V[(this._opcode & 0x00F0) >> 4];
                        this._program_counter += 2;
                        break;

                    case 0x1: // 8xy1: set Vx = Vx OR Vy
                        this._V[(this._opcode & 0x0F00) >> 8] |= this._V[(this._opcode & 0x00F0) >> 4];
                        this._program_counter += 2;
                        break;

                    case 0x2: // 8xy1: set Vx = Vx AND Vy
                        this._V[(this._opcode & 0x0F00) >> 8] &= this._V[(this._opcode & 0x00F0) >> 4];
                        this._program_counter += 2;
                        break;

                    case 0x3: // 8xy1: set Vx = Vx XOR Vy
                        this._V[(this._opcode & 0x0F00) >> 8] ^= this._V[(this._opcode & 0x00F0) >> 4];
                        this._program_counter += 2;
                        break;

                    case 0x4: // 8xy4: Vx = Vx + Vy, set VF to 1 if overflow?
                        let temp_8xy4 = this._V[(this._opcode & 0x0F00) >> 8] + this._V[(this._opcode & 0x00F0) >> 4];
                        if (temp_8xy4 > 255)
                            this._V[0xF] = 1;
                        else
                            this._V[0xF] = 0;

                        this._V[(this._opcode & 0x0F00) >> 8] += this._V[(this._opcode & 0x00F0) >> 4];
                        this._program_counter += 2;
                        break;

                    case 0x5: // 8xy5: Vx = Vx - Vy, if Vx > Vy then set VF to 1, else 0
                        if (this._V[(this._opcode & 0x0F00) >> 8] > this._V[(this._opcode & 0x00F0) >> 4])
                            this._V[0xF] = 1;
                        else
                            this._V[0xF] = 0;

                        this._V[(this._opcode & 0x0F00) >> 8] -= this._V[(this._opcode & 0x00F0) >> 4];
                        this._program_counter += 2;
                        break;

                    case 0x6: // 8xy6: Vx = Vx SHR 1, if least-sig bit of Vx is 1, VF = 1, else 0. Then, Vx = Vx / 2
                        if ((this._V[(this._opcode & 0x0F00) >> 8] & 0x0001) == 1)
                            this._V[0xF] = 1;
                        else
                            this._V[0xF] = 0;

                        this._V[(this._opcode & 0x0F00) >> 8] /= 2;
                        this._program_counter += 2;
                        break;

                    case 0x7: // 8xy7: 8xy5 but the other way round in terms of registers, sorta
                        if (this._V[(this._opcode & 0x00F0) >> 4] > this._V[(this._opcode & 0x0F00) >> 8])
                            this._V[0xF] = 1;
                        else
                            this._V[0xF] = 0;

                        this._V[(this._opcode & 0x0F00) >> 8] = (this._V[(this._opcode & 0x00F0) >> 4] - this._V[(this._opcode & 0x0F00) >> 8]);
                        this._program_counter += 2;
                        break;

                    case 0xE: // 8xyE: If most sig bit of Vx is 1, VF = 1, else 0. Vx = Vx * 2.
                        if ((this._V[(this._opcode & 0x0F00) >> 8] & 0x0001) == 1)
                            this._V[0xF] = 1;
                        else
                            this._V[0xF] = 0;

                        this._V[(this._opcode & 0x0F00) >> 8] *= 2;
                        this._program_counter += 2;
                        break;

                    default:
                        throw "Unknown this._opcode (0x8): " + this._opcode;
                }
                break;

            case 0x9000: // 9xy0: skip next instr if Vx != Vy
                if (this._V[(this._opcode & 0x0F00) >> 8] != this._V[(this._opcode & 0x00F0) >> 4])
                    this._program_counter += 4;
                else
                    this._program_counter += 2;
                break;

            case 0xA000: // Annn: Set I to addr nnn
                this._I = (this._opcode & 0x0FFF);
                this._program_counter += 2;
                break;

            case 0xB000: // Bnnn: JMP to nnn + V0
                this._program_counter = ((this._opcode & 0x0FFF) + this._V[0]);
                break;

            case 0xC000: // Cxkk: set Vx to random byte & kk
                this._V[(this._opcode & 0x0F00) >> 8] = ((Math.floor(Math.random() * 256)) & (this._opcode & 0x00FF));
                this._program_counter += 2;
                break;

            case 0xD000: // Dxyn: Draw an N pixel tall sprite from mem location I. at Vx and Vy
                let x = this._V[(this._opcode & 0x0F00) >> 8];
                let y = this._V[(this._opcode & 0x00F0) >> 4];
                let height = this._opcode & 0x000F;
                let pixel;

                this._V[0xF] = 0;
                for (let yline = 0; yline < height; yline++) {
                    pixel = this._memory[this._I + yline];
                    for (let xline = 0; xline < 8; xline++) {
                        if ((pixel & (0x80 >> xline)) != 0) {
                            if (this.gfx[(x + xline + ((y + yline) * 64))] == 1) {
                                this._V[0xF] = 1;
                            }
                            this.gfx[x + xline + ((y + yline) * 64)] ^= 1;
                        }
                    }
                }

                this.draw_flag = true;
                this._program_counter += 2;
                break;

            case 0xE000:
                switch (this._opcode & 0x00FF) {
                    case 0x9E: // Ex9E: skip next instr if key with val Vx is pressed
                        if (this._key[this._V[(this._opcode & 0x0F00) >> 8]])
                            this._program_counter += 4;
                        else
                            this._program_counter += 2;
                        break;

                    case 0xA1: // ExA1: skip next instr if key with val Vx is not pressed
                        if (!this._key[this._V[(this._opcode & 0x0F00) >> 8]])
                            this._program_counter += 4;
                        else
                            this._program_counter += 2;
                        break;

                    default:
                        throw "Unknown this._opcode (0xE): " + this._opcode;
                }
                break;

            case 0xF000:
                switch (this._opcode & 0x00FF) {
                    case 0x07: // Fx07: set Vx to delay timer val
                        this._V[(this._opcode & 0x0F00) >> 8] = this._delay_timer;
                        this._program_counter += 2;
                        break;

                    case 0x0A: // Fx0A: wait for keypress, store key val in Vx
                        let keyPress = false;

                        for (let i = 0; i < this._key.length; ++i) {
                            if (this._key[i]) {
                                this._V[(this._opcode & 0x0F00) >> 8] = i;
                                keyPress = true;
                                break;
                            }
                        }

                        if (!keyPress) {
                            // stop execution via setting flag that also enables key press hooks to 
                            // resume our execution.
                            this._await_key_press = true;
                            this._await_key_press_register = (this._opcode & 0x0F00) >> 8;
                        }

                        this._program_counter += 2;
                        break;

                    case 0x15: // Fx15: set delay timer to Vx
                        this._delay_timer = this._V[(this._opcode & 0x0F00) >> 8];
                        this._program_counter += 2;
                        break;

                    case 0x18: //Fx18: set sound timer to Vx
                        this._sound_timer = this._V[(this._opcode & 0x0F00) >> 8];
                        this._program_counter += 2;
                        break;

                    case 0x1E: // Fx1E: add Vx to I
                        this._I += this._V[(this._opcode & 0x0F00) >> 8];
                        this._program_counter += 2;
                        break;

                    case 0x29: // Fx29: Set I to memory location of sprite digit Vx
                        this._I = (this._V[(this._opcode & 0x0F00) >> 8] * 5);
                        this._program_counter += 2;
                        break;

                    case 0x33: // Fx33: for the val Vx, store binary 100ths digit at mem loc I, tens in I + 1, ones in I + 2
                        var temp_val_33 = this._V[(this._opcode & 0x0F00) >> 8];
                        this._memory[this._I] =  (temp_val_33 / 100);
                        this._memory[this._I + 1] =  ((temp_val_33 / 10) % 10);
                        this._memory[this._I + 2] = ((temp_val_33 % 100) % 10);

                        this._program_counter += 2;
                        break;

                    case 0x55: // Fx55: store V0 to Vx in mem, starting at loc I
                        for (let i = 0; i <= (this._opcode & 0x0F00) >> 8; ++i) {
                            this._memory[this._I + i] = this._V[i];
                        }

                        // apparently I = I + x + 1 after this?
                        this._I += this._V[(this._opcode & 0x0F00) >> 8];
                        this._I++;
                        this._program_counter += 2;
                        break;

                    case 0x65: // Fx65: load mem vals into V0 to Vx starting from mem[I]
                        for (let i = 0; i <= (this._opcode & 0x0F00) >> 8; ++i)
                        {
                            this._V[i] = this._memory[this._I + i];
                        }

                        // apparently I = I + x + 1 after this?
                        this._I += this._V[(this._opcode & 0x0F00) >> 8];
                        this._I++;
                        this._program_counter += 2;
                        break;
                }
                break;
            default:
                throw "Unknown this._opcode: " + this._opcode;
        }

        // update timers
        if (this._delay_timer > 0){
            this._delay_timer--;
        }

        if (this._sound_timer > 0) {
            if (this._sound_timer == 1)
            {
                console.log("beep.");
            }

            this._sound_timer--;
        }
    }
}
