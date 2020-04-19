//export const TEST = 'test';
export const JIGSAW_DATA = [
    // ภาพ 1
    {
        board: {
            image: require('../../assets/images/jigsaw/01/board.jpg'),
        },
        sound: 'music.m4a',
        pieces: [
            {
                image: require('../../assets/images/jigsaw/01/pieces/01.png'),
                left: 0, top: 0,
                visible: false,
            },
            {
                image: require('../../assets/images/jigsaw/01/pieces/02.png'),
                left: 308, top: 0,
                visible: false,
            },
            {
                image: require('../../assets/images/jigsaw/01/pieces/03.png'),
                right: -2, top: 0,
                visible: false,
            },
            {
                image: require('../../assets/images/jigsaw/01/pieces/04.png'),
                left: 0, bottom: 0,
                visible: false,
            },
            {
                image: require('../../assets/images/jigsaw/01/pieces/05.png'),
                left: 205, bottom: 0,
                visible: false,
            },
            {
                image: require('../../assets/images/jigsaw/01/pieces/06.png'),
                right: -1, bottom: 0,
                visible: false,
            },
        ],
    },

    // ภาพ 2
    {},

    // ภาพ 3
    {
        board: {
            image: require('../../assets/images/jigsaw/03/board.jpg'),
        },
        sound: 'music.m4a',
        /*
            (963 * x) / 1283
            1: (963 * 582) / 1283 = 436.84
            2: (963 * 462) / 1283 = 346.77
            3: (963 * 583) / 1283 = 437.59
            4: (963 * 444) / 1283 = 333.25
            5: (963 * 738) / 1283 = 553.93
            6: (963 * 445) / 1283 = 334.01
            7: (963 * 582) / 1283 = 436.84
            8: (963 * 462) / 1283 = 346.77
            9: (963 * 583) / 1283 = 437.59
        */
        pieces: [
            {
                image: require('../../assets/images/jigsaw/03/pieces/01.png'),
                left: 0, top: 0,
                visible: false,
                touches: [
                    {x: 60, y: 130},
                    {x: 300, y: 130},
                ],
            },
            {
                image: require('../../assets/images/jigsaw/03/pieces/02.png'),
                left: 308, top: 0,
                visible: false,
                touches: [
                    {x: 370, y: 210},
                    {x: 590, y: 50},
                ],
            },
            {
                image: require('../../assets/images/jigsaw/03/pieces/03.png'),
                right: 0, top: 0,
                visible: false,
                touches: [
                    {x: 640, y: 130},
                    {x: 910, y: 210},
                ],
            },
            {
                image: require('../../assets/images/jigsaw/03/pieces/04.png'),
                left: 0, top: 163,
                visible: false,
                touches: [
                    {x: 160, y: 280},
                    {x: 160, y: 490},
                ],
            },
            {
                image: require('../../assets/images/jigsaw/03/pieces/05.png'),
                left: 204, top: 246,
                visible: false,
                touches: [
                    {x: 410, y: 385},
                    {x: 560, y: 385},
                ],
            },
            {
                image: require('../../assets/images/jigsaw/03/pieces/06.png'),
                right: 0, top: 163,
                visible: false,
                touches: [
                    {x: 740, y: 310},
                    {x: 870, y: 440},
                ],
            },
            {
                image: require('../../assets/images/jigsaw/03/pieces/07.png'),
                left: 0, bottom: 2,
                visible: false,
                touches: [
                    {x: 55, y: 550},
                    {x: 255, y: 700},
                ],
            },
            {
                image: require('../../assets/images/jigsaw/03/pieces/08.png'),
                left: 308, bottom: 2,
                visible: false,
                touches: [
                    {x: 485, y: 550},
                    {x: 485, y: 680},
                ],
            },
            {
                image: require('../../assets/images/jigsaw/03/pieces/09.png'),
                right: 0, bottom: 2,
                visible: false,
                touches: [
                    {x: 900, y: 580},
                    {x: 700, y: 710},
                ],
            },
        ],
    },
];
