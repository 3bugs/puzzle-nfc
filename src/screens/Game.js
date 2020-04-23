import React, {useState, useEffect} from 'react';
import {
    SafeAreaView,
    StyleSheet,
    View,
    Text,
    Button,
    Image,
    ImageBackground,
    StatusBar,
    TouchableOpacity,
    Dimensions,
} from 'react-native';

import NfcManager, {NfcEvents} from 'react-native-nfc-manager';
import Sound from 'react-native-sound';
// Enable playback in silence mode
Sound.setCategory('Playback');

import * as Constants from '../constants';

const {width, height} = Dimensions.get('window');
//alert(`Screen [width: ${width}, height: ${height}]`);
const longestWidth = width > height ? width : height;
const isLargeScreen = longestWidth > 900;
const BOARD_MARGIN = isLargeScreen ? 100 : 40;
const TOUCH_POINT_SIZE = 26;
const SHOW_TOUCH_POINTS = true;
const MODE = 1; // 1: พื้นหลังเป็นภาพสีจาง, 2: พื้นหลังเป็นสีดำ

function Game() {
    const jigsawData = Constants.JIGSAW_DATA[2];

    const touchPoints = [];
    jigsawData.pieces.forEach(piece => {
        piece.touches.forEach(touch => {
            touchPoints.push(touch);
        });
    });
    //console.log('TOUCH POINTS: ' + JSON.stringify(touchPoints));

    const boardImage = jigsawData.board.image;
    const {sound} = jigsawData;

    const [boardWidth, setBoardWidth] = useState(0);
    const [boardHeight, setBoardHeight] = useState(0);
    const [boardAndImageSourceRatio, setBoardAndImageSourceRatio] = useState(1.0);
    const [pieces, setPieces] = useState(jigsawData.pieces);
    const [touches, setTouches] = useState([]);

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
    /*useEffect(() => {
        NfcManager.start();
        NfcManager.setEventListener(NfcEvents.DiscoverTag, tag => {
            //console.warn('tag', tag);
            //alert('พบ NFC Tag - ID: ' + tag.id);
            //NfcManager.setAlertMessageIOS('I got your tag!');
            //NfcManager.unregisterTagEvent().catch(() => 0);

            if (tag.id === '451D5D9A') {
                showPiece(pieces[0]);
            } else if (tag.id === '05C1719B') {
                showPiece(pieces[1]);
            }
        });

        try {
            NfcManager.registerTagEvent();
        } catch (ex) {
            console.warn('ex', ex);
            NfcManager.unregisterTagEvent().catch(() => 0);
        }

        return () => {
            NfcManager.setEventListener(NfcEvents.DiscoverTag, null);
            NfcManager.unregisterTagEvent().catch(() => 0);
        }
    }, []);*/

    const test = async () => {
        try {
            await NfcManager.registerTagEvent();
        } catch (ex) {
            console.warn('ex', ex);
            NfcManager.unregisterTagEvent().catch(() => 0);
        }
    };

    const cancelTest = () => {
        NfcManager.unregisterTagEvent().catch(() => 0);
    };

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

    const showPiece = piece => {
        piece.visible = true;
        /*const nextMaxZIndex = pieces.reduce((pieceMaxZIndex, piece) =>
            ((pieceMaxZIndex.zIndex > piece.zIndex) ? pieceMaxZIndex : piece)
        )[0].zIndex + 1;
        piece.zIndex = nextMaxZIndex;*/
        setPieces(pieces.slice());
    };

    const handleTouch = e => {
        const allTouches = e.nativeEvent.touches;
        setTouches(allTouches);
        console.log('START: ' + allTouches.length);
        console.log(allTouches);

        for (let i = 0; i < pieces.length; i++) {
            let hit = true;
            const piece = pieces[i];
            for (let j = 0; j < piece.touches.length; j++) {
                const touchPoint = piece.touches[j];
                const numHit = allTouches.reduce((total, userTouch) => {
                    if ((userTouch.locationX > (touchPoint.x * boardAndImageSourceRatio) - (TOUCH_POINT_SIZE / 2))
                        && (userTouch.locationX < (touchPoint.x * boardAndImageSourceRatio) + (TOUCH_POINT_SIZE / 2))
                        && (userTouch.locationY > (touchPoint.y * boardAndImageSourceRatio) - (TOUCH_POINT_SIZE / 2))
                        && (userTouch.locationY < (touchPoint.y * boardAndImageSourceRatio) + (TOUCH_POINT_SIZE / 2))) {
                        return total + 1;
                    } else {
                        return total;
                    }
                }, 0);

                hit = hit && (numHit > 0);
            }
            if (hit) {
                if (!piece.visible) {
                    piece.visible = true;
                    setPieces(pieces.slice());
                }
                break;
            }
        }

        return false;
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
                {/*<View>
                    <Text style={[styles.text, {textAlign: 'center', padding: 8}]}>{touches.length > 0 ? `มีการแตะภาพ ${touches.length} ตำแหน่ง` : 'ยังไม่มีการแตะภาพ'}</Text>
                    {touches.map((touch, index) => (
                        <Text
                            key={index}
                            style={[styles.text, {textAlign: 'center', padding: 4}]}
                        >{`X: ${touch.locationX.toFixed(2)}, Y: ${touch.locationY.toFixed(2)}`}</Text>
                    ))}
                </View>*/}
                <View
                    style={{flex: 1, justifyContent: 'center', alignItems: 'center', padding: 0, borderWidth: 0, borderColor: 'red'}}
                    onLayout={onLayout}
                >
                    {(boardWidth > 0) && (boardHeight > 0) &&
                    <View
                        style={{width: boardWidth, height: boardHeight, borderWidth: 0, borderColor: '#ccc'}}>
                        <ImageBackground
                            style={{backgroundColor: 'black', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%'}}
                            source={MODE === 1 ? boardImage : null}
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

                                /*<TouchableOpacity
                                        key={index}
                                        style={[styles.pieceTouchable, touchableStyle]}
                                        activeOpacity={0.6}
                                        onPress={() => showPiece(piece)}
                                    >
                                        <Image
                                            style={pieceStyle}
                                            source={piece.visible ? piece.image : null}
                                        />
                                    </TouchableOpacity>*/
                                return (
                                    <Image
                                        key={index}
                                        style={[styles.pieceTouchable, pieceStyle, touchableStyle]}
                                        source={piece.visible ? piece.image : null}
                                    />
                                );
                            })}

                            {SHOW_TOUCH_POINTS && touchPoints.map((point, index) => (
                                <View
                                    key={index}
                                    style={{
                                        position: 'absolute',
                                        width: TOUCH_POINT_SIZE, height: TOUCH_POINT_SIZE,
                                        left: (point.x * boardAndImageSourceRatio) - (TOUCH_POINT_SIZE / 2),
                                        top: (point.y * boardAndImageSourceRatio) - (TOUCH_POINT_SIZE / 2),
                                        backgroundColor: 'rgba(255, 0, 0, 0.5)',
                                        borderRadius: TOUCH_POINT_SIZE / 2,
                                    }}
                                />
                            ))}

                            <View
                                style={{
                                    position: 'absolute',
                                    width: '100%', height: '100%',
                                    borderWidth: 1,
                                    borderColor: '#aaa',
                                }}
                                onStartShouldSetResponder={handleTouch}

                                onResponderGrant={e => {
                                    //console.log('GRANT!');
                                    /*const allTouches = e.nativeEvent.touches;
                                    console.log(allTouches);*/
                                }}
                            />
                        </ImageBackground>
                    </View>
                    }
                </View>
                {/*<View
                    style={{flexDirection: 'row', justifyContent: 'space-between'}}
                >
                    <Button
                        title={'Test NFC'}
                        onPress={test}
                    />
                    <Button
                        title={'Cancel Test NFC'}
                        onPress={cancelTest}
                    />
                </View>*/}
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
    text: {
        color: '#666',
        fontSize: 18,
    },
});

export default Game;
