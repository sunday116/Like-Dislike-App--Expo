import React, { useRef, useState } from 'react';
import { StyleSheet, Image, View, PanResponder, Animated, Text } from 'react-native';
import { ImageBackground, TouchableOpacity } from 'react-native-web';
import * as FileSystem from 'expo-file-system';

export default function App() {
    const pan = useRef(new Animated.ValueXY()).current;
    const [img, setImg] = useState(1); // Set Display Image
    const [message, setMessage] = useState(null); // Set Stamp Text

    // Set Value for Image Animation
    const [imageOpacityVal, setImageOpacityVal] = useState(false);
    const [imageRotateValLeft, setImageRotateValLeft] = useState(false);
    const [imageRotateValRight, setImageRotateValRight] = useState(false);
    const [imageSize, setImageSize] = useState(false);

    // Set Value for Stamp Animation
    const [stamp, setStamp] = useState(false)

    // Set Action Enable/Disable
    const [swapAction, setSwapAction] = useState(true);

    // Main Swap Action
    const panResponder = PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderMove: (event, gesture) => {
            if (swapAction) {

                // Disable Swap Action
                setSwapAction(false);

                // Hide Image Action
                if (gesture.dx < 0) {
                    pan.setValue({ x: -(1 * window.innerWidth), y: window.innerHeight / 5 });
                    setImageRotateValRight(true);
                } else {
                    pan.setValue({ x: 1 * window.innerWidth, y: window.innerHeight / 5 });
                    setImageRotateValLeft(true)
                }
                setImageSize(true);
                setImageOpacityVal(true)

                setStamp(true)
                // Set Return to Position
                setTimeout(() => {
                    pan.setValue({ x: 0, y: 0 });
                    setImageRotateValLeft(false);
                    setImageRotateValRight(false);
                }, 500);

                // Show Image Action
                setTimeout(() => {
                    setImageOpacityVal(false);
                    setImageSize(false)
                }, 1000);


                // Check the direction of the movement
                if (gesture.dx < 0) {
                    setMessage('Nope');
                } else {
                    setMessage('Like!');
                }
            } else {
                setTimeout(() => {
                    Animated.spring(pan, { toValue: { x: -0, y: -0 } }).start(() => {
                        if (message) {

                            setStamp(false)

                            // Clear the message when animation completes
                            setMessage(null);

                            // Set Next Image
                            if (img == 6) {
                                setImg(1);
                            } else {
                                setImg(img + 1);
                            }
                        }
                    });
                }, 1000);
            }
        },
        onPanResponderRelease: () => {
            setTimeout(() => {
                // Enable Swap Action
                setSwapAction(true)
            }, 1000);
        }
    });

    // Download Button Action
    const handleDownload = async () => {

        // Adjust the path based on your project structure
        const currentImageUri = `./assets/img/${img}.png`;

        // Set Download URI
        const downloadUri = FileSystem.documentDirectory + `downloaded_image_${img}.png`;

        // Download Action
        try {
            // Success Handler
            await FileSystem.downloadAsync(
                currentImageUri,
                downloadUri
            );
        } catch (error) {
            // Catch Handler
            console.error('Error downloading image:');
        }
    };

    return (
        <ImageBackground source={require('./assets/bg.jpg')} style={styles.container}>

            {/* Main Image UI */}
            <View style={styles.imageContainer}>

                {/* Image */}
                <Animated.View
                    {...panResponder.panHandlers}
                    style={[pan.getLayout(),
                    styles.image,
                    imageRotateValLeft ? styles.imageRotateLeft : null,
                    imageRotateValRight ? styles.imageRotateRight : null,
                    imageOpacityVal ? styles.imageOpacity : null,
                    imageSize ? styles.smallImage : styles.genImage]}
                >
                    <Image
                        source={require('./assets/img/' + img + '.png')}
                        style={{ width: '100%', height: '100%', resizeMode: 'contain' }}
                    />
                </Animated.View>

                {/* Stamp */}
                <View style={styles.messageContainer}>
                    {message && (
                        <Text
                            style={message == 'Nope' ?
                                stamp ?
                                    styles.nopeMessage
                                    :
                                    styles.defaultMessage
                                :
                                stamp ?
                                    styles.likeMessage
                                    :
                                    styles.defaultMessage
                            }
                        >
                            {message}
                        </Text>
                    )}
                </View>

            </View>

            {/* Download Button UI */}
            <TouchableOpacity onPress={handleDownload}>
                <Image
                    source={require('./assets/download.png')}
                    style={styles.downloadBtn}
                />
            </TouchableOpacity>

            {/* Footer UI */}
            <View style={styles.arrowContainer}>
                <Image source={require('./assets/arrow-left.png')} style={{ width: '60px', height: '60px' }} />
                <Text style={styles.nopeText}>Nope</Text>
                <Text style={styles.likeText}>Like!</Text>
                <Image source={require('./assets/arrow-right.png')} style={{ width: '60px', height: '60px' }} />
            </View>

        </ImageBackground>
    );
}

// Stylesheet
const styles = StyleSheet.create({
    // Main Container CSS
    container: {
        flex: 1,
        flexDirection: 'row',
        position: 'relative',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        width: '100%',
        height: '100%',
        overflow: 'hidden'
    },

    // Download Button CSS
    downloadBtn: {
        width: 50,
        height: 50,
        position: 'fixed',
        top: 25,
        right: 25,
        borderRadius: 40
    },

    // Default Image Container CSS
    imageContainer: {
        flex: 1,
        position: 'relative',
    },

    // Image Rotate CSS
    imageRotateLeft: {
        rotate: '90deg',
        width: '50%'
    },
    imageRotateRight: {
        rotate: '-90deg',
        width: '50%'
    },

    // Image Show/Hidden CSS
    imageOpacity: {
        opacity: 0
    },

    // Image Size CSS
    genImage: {
        width: '100%',
    },
    smallImage: {
        width: '50%'
    },

    // Image Main CSS
    image: {
        marginLeft: 'auto',
        marginRight: 'auto',
        height: '100%',
        paddingLeft: '10%',
        paddingRight: '10%',
        position: 'relative',
        resizeMode: 'contain',
        transition: 'all 0.5s'
    },

    // Stamp Container CSS
    messageContainer: {
        position: 'absolute',
        top: '60%', // Adjust the positioning as needed
        left: '0px', // Adjust the positioning as needed
        width: '100%',
        alignItems: 'center', // Center the text horizontally
        transform: [{ translateY: -50 }],
    },

    // Stamp CSS
    defaultMessage: {
        color: 'white',
        fontSize: 0,
        marginTop: 40,
        width: 'fit-content',
        marginLeft: 'auto',
        marginRight: 'auto',
    },

    // Nope Stamp CSS
    nopeMessage: {
        color: 'red',
        border: '1px solid #ff0000',
        borderRadius: 5,
        paddingInline: '50px',
        fontSize: 80,
        width: 'fit-content',
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: 0,
        transition: 'all 0.5s'
    },

    // Like Stamp CSS
    likeMessage: {
        color: 'green',
        border: '1px solid #00ff00',
        borderRadius: 5,
        paddingInline: '50px',
        fontSize: 80,
        width: 'fit-content',
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: 0,
        transition: 'all 0.5s'
    },

    // Footer CSS
    arrowContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        position: 'absolute',
        bottom: 20, // Adjust the positioning as needed
        width: '100%',
    },
    leftArrow: {
        width: 0,
        height: 0,
        borderTopWidth: 10,
        borderBottomWidth: 10,
        borderRightWidth: 15,
        borderTopColor: 'transparent',
        borderBottomColor: 'transparent',
        borderRightColor: 'red',
    },
    leftArrowLine: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 30,
        width: 2,
        backgroundColor: 'green',
    },
    rightArrowLine: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        right: 0,
        width: 2,
        backgroundColor: 'red',
    },
    rightArrow: {
        width: 0,
        height: 0,
        borderTopWidth: 10,
        borderBottomWidth: 10,
        borderLeftWidth: 15,
        borderTopColor: 'transparent',
        borderBottomColor: 'transparent',
        borderLeftColor: 'green',
    },
    nopeText: {
        color: 'red',
        fontSize: '30px',
        paddingBottom: '0px',
        marginBottom: '0px',
        lineHeight: '50px'
    },
    likeText: {
        color: 'green',
        fontSize: '30px',
        paddingBottom: '0px',
        marginBottom: '0px',
        lineHeight: '50px'
    },
});