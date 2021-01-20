//% color=#5042f4 icon="\uf2c9"
namespace DS18B20{
    let sc_byte = 0
    let dat = 0
    let low = 0
    let high = 0
    let temp = 0
    let temperature = 0
    let ack = 0
    let lastTemp = 0
    let mpin = 0
    export enum ValType {
        //% block="temperature(℃)" enumval=0
        DS18B20_temperature_C,

        //% block="temperature(℉)" enumval=1
        DS18B20_temperature_F
    }

    //% block="set pin %pin"
    export function argpin(pin: DigitalPin) {
        mpin = pin
    }

    function init_18b20() {
        pins.digitalWritePin(mpin, 0)
        control.waitMicros(600)
        pins.digitalWritePin(mpin, 1)
        control.waitMicros(30)
        ack = pins.digitalReadPin(mpin)
        control.waitMicros(600)
        return ack
    }
    function write_18b20 (data: number) {
        sc_byte = 0x01
        for (let index = 0; index < 8; index++) {
            pins.digitalWritePin(mpin, 0)
            if (data & sc_byte) {
                pins.digitalWritePin(mpin, 1)
                control.waitMicros(60)
            } else {
                pins.digitalWritePin(mpin, 0)
                control.waitMicros(60)
            }
            pins.digitalWritePin(mpin, 1)
            data = data >> 1
        }
    }
    function read_18b20 () {
        dat = 0x00
        sc_byte = 0x01
        for (let index = 0; index < 8; index++) {
            pins.digitalWritePin(mpin, 0)
            pins.digitalWritePin(mpin, 1)
            if (pins.digitalReadPin(mpin)) {
                dat = dat + sc_byte
            }
            sc_byte = sc_byte << 1
            control.waitMicros(60)
        }
        return dat
    }
    //% block="value of DS18B20 %state at pin %pin"
    export function Ds18b20Temp():number{
        init_18b20(pin)
        write_18b20(pin,0xCC)
        write_18b20(pin,0x44)
        basic.pause(10)
        init_18b20(pin)
        write_18b20(pin,0xCC)
        write_18b20(pin,0xBE)
        low = read_18b20(pin)
        high = read_18b20(pin)
        temperature = high << 8 | low
        temperature = temperature / 16
        if(temperature > 130){
            temperature = lastTemp
        }
        lastTemp = temperature
        /**switch (state) {
            case ValType.DS18B20_temperature_C:
                return temperature
            case ValType.DS18B20_temperature_F:
                temperature = temperature * 33.8
                return temperature
            default:
                return 0
        } */
        return temperature
        

    }

}
