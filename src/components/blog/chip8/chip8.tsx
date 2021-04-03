import React from "react";
import CodeSnippet from '../code_snippet';
import Chip8Component from '../../../projects/chip8/chip8_component';
import './chip8.scss';

class Chip8 extends React.Component {
    render() {
        const codeSnippet1 = `case 0x2000: // 2nnn: CALL addr
    this._stack_ptr++;

    // put return addr in the stack
    // add 2 so we store the next instruction, otherwise we will cause an infinite loop!
    this._stack[this._stack_ptr] = this._program_counter + 2; 

    this._program_counter = (this._opcode & 0x0FFF);
    break;`
        
        const codeSnippet2 = `for (let i = 0; i < (64 * 32); i++) { 
        let x = i % 64;
        let y = Math.floor(i / 64);
        ...
    }`

        return (
            <React.Fragment>
            <p>
                I was looking for something cool and was familiar with emulators and thought about what it would take 
                to actually get into emulator development. After a brief search a few people recommend starting off trying 
                to implement a CHIP-8 emulator/interpretor. This is because CHIP-8 is actually just a programming language. 
                (Hence interptetor). And therefore the "architecture" is simple. You just need to implement a bunch of 
                instructions (aka opcodes), and then draw what ever is produced in the output buffer. There are only 35 
                opcodes and most of them are very simple to implement.
            </p>

            <p>
                I used <a href='http://devernay.free.fr/hacks/chip8/C8TECH10.HTM'>Cowgod's technical reference</a> 
                for the opcodes when implementing them. Doing so requires good familiarity with bit manipulation operators 
                in your chosen language, particularly the shift operators (commonly <code>&lt;&lt;</code> and <code>&gt;&gt;</code>). 
            </p>

            <p>
                I started this in C# and implemented all the opcodes. However once it was time to draw to the screen, I realized that 
                there isn't a simple "canvas" graphics library. Well at least not in .NET Core as it has to be platform independant. 
                This basically meant that I had to use opengl to draw. However I wasn't up for doing that just now as opengl is very 
                verbose. It would be like creating your own paint from scratch in order to paint a small door. So instead I decided to 
                re-implement everything in JS. At least now I can present it nicely in a website!
            </p>

            <p>
                Luckily I could just copy and paste most of the code over, and then do some cheeky find and replaces to fix things up.
                Although javascript has no <i>strict</i> type system, it does have typed arrays. <code>UInt8Array</code> was probably
                the most used. I will now show you some of the silly mistakes I made when implementing it.
            </p>

            <p>
                One mistake I made was when implementing the <code>0x2nnn</code> (Call addr) instruction. At first I would push the 
                current program counter to the stack and then set the program count to nnn (the location of the function we are 
                calling). However this will actually cause an infinite loop. Because when the function returns, it will pop the stack
                and set the program counter back... to the location of the function call again. So what I actually needed to do was 
                either increment the program counter before pushing onto the stack or after poping it from the stack. This sounds so 
                obvious in hignsight but I was blindly following the technical reference wording.
            </p>

            <CodeSnippet code={codeSnippet1}/>

            <p>
                The next isn't really a mistake, but it was unclear how exactly to interpret the graphics buffer. Eventually After 
                some searching I found out that its stored "column wise" rendering from y = 0 down for each x (assuming (0,0) is the  
                top left corner). 
            </p>

            <CodeSnippet code={codeSnippet2}/>

            Before the above I somehow managed to render a 90 degree rotaded version!

            <Chip8Component style={{marginTop: '30px'}}/>
            </React.Fragment>
        )
    }
}

export default Chip8;