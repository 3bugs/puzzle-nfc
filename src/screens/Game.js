import React, {useState, useEffect} from 'react';
import {
    SafeAreaView,
    StyleSheet,
    View,
    Button,
    Image,
    ImageBackground,
    StatusBar,
    TouchableOpacity,
    Dimensions,
} from 'react-native';

import Sound from 'react-native-sound';
// Enable playback in silence mode
Sound.setCategory('Playback');

import * as Constants from '../constants';

const {width, height} = Dimensions.get('window');
//alert(`Screen [width: ${width}, height: ${height}]`);
const longestWidth = width > height ? width : height;
const isLargeScreen = longestWidth > 900;
const BOARD_MARGIN = isLargeScreen ? 100 : 40;

function Game() {
    const boardImage = Constants.JIGSAW_DATA[0].board.image;
    const {sound} = Constants.JIGSAW_DATA[0];

    const [boardWidth, setBoardWidth] = useState(0);
    const [boardHeight, setBoardHeight] = useState(0);
    const [boardAndImageSourceRatio, setBoardAndImageSourceRatio] = useState(1.0);
    const [pieces, setPieces] = useState(Constants.JIGSAW_DATA[0].pieces);

    pieces.forEach((piece, index) => {
        const {width, height} = Image.resolveAssetSource(piece.image);
        piece.width = width;
        piece.height = height;
        //piece.zIndex = index;
    });

    let music = null;
    useEffect(() => {
        // Load the sound file from the app bundle
        music = new Sound(sound, Sound.MAIN_BUNDLE, error => {
            if (error) {
                console.log('failed to load the sound', error);
                return;
            }
            // loaded successfully
            console.log('duration in seconds: ' + music.getDuration());

            // Loop indefinitely until stop() is called
            music.setNumberOfLoops(-1);

            // Play the sound with an onEnd callback
            music.play(success => {
                if (success) {
                    console.log('successfully finished playing');
                } else {
                    console.log('playback failed due to audio decoding errors');
                }
            });
        });
    }, []);
    useEffect(() => () => {
        if (music) {
            // Stop the sound and rewind to the beginning
            music.stop();
            // Release the audio player resource
            music.release();
        }
    }, []);

    const onLayout = (e) => {
        console.log(`Layout [width: ${e.nativeEvent.layout.width}, height: ${e.nativeEvent.layout.height}]`);

        const {width: layoutWidth, height: layoutHeight} = e.nativeEvent.layout;
        const layoutRatio = layoutWidth / layoutHeight;
        const {width: imageSourceWidth, height: imageSourceHeight} = Image.resolveAssetSource(boardImage);
        const imageSourceRatio = imageSourceWidth / imageSourceHeight;

        let width, height;
        if (layoutRatio > imageSourceRatio) {
            height = layoutHeight - BOARD_MARGIN;
            width = (imageSourceWidth * height) / imageSourceHeight;
        } else {
            width = layoutWidth - BOARD_MARGIN;
            height = (imageSourceHeight * width) / imageSourceWidth;
        }

        setBoardWidth(width);
        setBoardHeight(height);
        setBoardAndImageSourceRatio(width / imageSourceWidth);
    };

    const showPiece = (piece) => {
        piece.visible = true;
        /*const nextMaxZIndex = pieces.reduce((pieceMaxZIndex, piece) =>
            ((pieceMaxZIndex.zIndex > piece.zIndex) ? pieceMaxZIndex : piece)
        )[0].zIndex + 1;
        piece.zIndex = nextMaxZIndex;*/
        setPieces(pieces.slice());
    };

    return (
        <View style={{flex: 1}}>
            <StatusBar barStyle="dark-content"/>
            <SafeAreaView style={{flex: 1}}>
                <Button
                    title={'CLEAR'}
                    onPress={() => {
                        pieces.forEach(piece => piece.visible = false);
                        setPieces(pieces.slice());
                    }}
                />
                <View
                    style={{flex: 1, justifyContent: 'center', alignItems: 'center', padding: 0, borderWidth: 0, borderColor: 'red'}}
                    onLayout={onLayout}
                >
                    {(boardWidth > 0) && (boardHeight > 0) &&
                    <View
                        style={{width: boardWidth, height: boardHeight, borderWidth: 0, borderColor: '#ccc'}}>
                        <ImageBackground
                            style={{justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%'}}
                            source={boardImage}
                            resizeMode={'contain'}
                        >
                            {pieces.map((piece, index) => {
                                const {width, height} = piece;
                                const pieceStyle = {
                                    width: width * boardAndImageSourceRatio,
                                    height: height * boardAndImageSourceRatio,
                                };
                                const touchableStyle = {};
                                //touchableStyle.zIndex = piece.zIndex;
                                if (piece.top != null) {
                                    touchableStyle.top = piece.top * boardAndImageSourceRatio;
                                }
                                if (piece.left != null) {
                                    touchableStyle.left = piece.left * boardAndImageSourceRatio;
                                }
                                if (piece.right != null) {
                                    touchableStyle.right = piece.right * boardAndImageSourceRatio;
                                }
                                if (piece.bottom != null) {
                                    touchableStyle.bottom = piece.bottom * boardAndImageSourceRatio;
                                }

                                return (
                                    <TouchableOpacity
                                        key={index}
                                        style={[styles.pieceTouchable, touchableStyle]}
                                        activeOpacity={0.6}
                                        onPress={() => showPiece(piece)}
                                    >
                                        <Image
                                            style={pieceStyle}
                                            source={piece.visible ? piece.image : null}
                                        />
                                    </TouchableOpacity>
                                );
                            })}
                        </ImageBackground>
                    </View>
                    }
                </View>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    pieceTouchable: {
        position: 'absolute',
        borderWidth: 0,
        borderColor: 'red',
    },
});

export default Game;
