import React, {useState, useEffect} from 'react';
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View,
    Text,
    Image,
    ImageBackground,
    StatusBar,
    Dimensions,
    Button,
    Alert,
} from 'react-native';

const imageBoard = require('../../assets/images/jigsaw/01/board.jpg');
const pieces = [
    {
        image: require('../../assets/images/jigsaw/01/pieces/01.png'),
        left: 0, top: 0,
    },
    {
        image: require('../../assets/images/jigsaw/01/pieces/02.png'),
        left: 308, top: 0,
    },
    {
        image: require('../../assets/images/jigsaw/01/pieces/03.png'),
        right: -2, top: 0,
    },
    {
        image: require('../../assets/images/jigsaw/01/pieces/04.png'),
        left: 0, bottom: 0,
    },
    {
        image: require('../../assets/images/jigsaw/01/pieces/05.png'),
        left: 205, bottom: 0,
    },
    {
        image: require('../../assets/images/jigsaw/01/pieces/06.png'),
        right: 0, bottom: 0,
    },
];

function Game() {
    const [boardWidth, setBoardWidth] = useState(0);
    const [boardHeight, setBoardHeight] = useState(0);
    const [boardAndImageSourceRatio, setBoardAndImageSourceRatio] = useState(1.0);

    const {width: imageSourceWidth, height: imageSourceHeight} = Image.resolveAssetSource(imageBoard);

    pieces.forEach(piece => {
        const {width, height} = Image.resolveAssetSource(piece.image);
        piece.width = width;
        piece.height = height;
    });

    useEffect(() => {
    });

    const onLayout = (e) => {
        console.log(`Layout [width: ${e.nativeEvent.layout.width}, height: ${e.nativeEvent.layout.height}]`);

        const {width: layoutWidth, height: layoutHeight} = e.nativeEvent.layout;
        const layoutRatio = layoutWidth / layoutHeight;
        const imageSourceRatio = imageSourceWidth / imageSourceHeight;

        let width, height;
        if (layoutRatio > imageSourceRatio) {
            height = layoutHeight - 100;
            width = (imageSourceWidth * height) / imageSourceHeight;
        } else {
            width = layoutWidth - 100;
            height = (imageSourceHeight * width) / imageSourceWidth;
        }

        setBoardWidth(width);
        setBoardHeight(height);
        setBoardAndImageSourceRatio(width / imageSourceWidth);
    };

    return (
        <View style={{flex: 1}}>
            <StatusBar barStyle="dark-content"/>
            <SafeAreaView style={{flex: 1}}>
                <View
                    style={{flex: 1, justifyContent: 'center', alignItems: 'center', padding: 0, borderWidth: 0, borderColor: 'red'}}
                    onLayout={onLayout}
                >
                    {(boardWidth > 0) && (boardHeight > 0) &&
                    <View
                        style={{width: boardWidth, height: boardHeight, borderWidth: 0, borderColor: '#ccc'}}>
                        <ImageBackground
                            style={{justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%'}}
                            source={imageBoard}
                            resizeMode={'contain'}
                        >
                            {pieces.map((piece, index) => {
                                const style = {
                                    width: piece.width * boardAndImageSourceRatio,
                                    height: piece.height * boardAndImageSourceRatio,
                                };
                                if (piece.top != null) {
                                    style.top = piece.top * boardAndImageSourceRatio;
                                }
                                if (piece.left != null) {
                                    style.left = piece.left * boardAndImageSourceRatio;
                                }
                                if (piece.right != null) {
                                    style.right = piece.right * boardAndImageSourceRatio;
                                }
                                if (piece.bottom != null) {
                                    style.bottom = piece.bottom * boardAndImageSourceRatio;
                                }

                                if (index === 0 || index === 4) {
                                    return (
                                        <Image
                                            style={[styles.piece, style]}
                                            source={piece.image}
                                        />
                                    );
                                } else {
                                    return (<View/>);
                                }
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
    piece: {
        position: 'absolute',
        borderWidth: 0,
        borderColor: 'red',
    }
});

export default Game;
