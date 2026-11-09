const birthdayConfig = {
  recipient: { name: 'Supreethika', nickname: 'Supreethika' },
  password: 'Sampoornesh Babu',
  welcome: {
    title: 'Someone has prepared something special for you...',
    subtitle: 'Enter your favourite actor name to unlock your surprise',
    hint: 'You already know it 💛',
  },
  camera: {
    message1: 'Heyyy! Today is not an ordinary day...',
    message2: "It's YOUR special day! 🎉",
    message3: "Let's celebrate the amazing person you are!",
    capturedPhotoText: 'The most beautiful soul I know 💛',
    capturedImage: '/assets/photos/captured-surprise.jpg.jpeg',
    captureMode: 'display_placeholder_image', showFlashEffect: true, playShutterSound: true,
  },
  cake: {
    wishPrompt: 'Make a wish...',
    afterWish: "May all your dreams come true! ✨ Such as each person will have one SSCR, no one needs to work on their birthday, patience-less things will always be patience-less... you'll get all the things you wished for! ❤️",
    continueText: 'Ready for a little surprise?',
  },
  photos: [
    { src: '/assets/photos/slack-photo.jpg', caption: 'Sorry for taking your photo without your permission... (Source: Slack) 📸', rotation: -3, source: 'Slack' },
    { src: '/assets/photos/whatsapp-photo.jpg', caption: 'Sorry for taking your photo without your permission... (Source: WhatsApp) 😂', rotation: 3, source: 'WhatsApp' },
  ],
  gifts: [
    { id: 1, title: 'A Little Happiness', description: 'Flowers just for you!', type: 'flowers', image: '/assets/gifts/flowers.png', color: '#e74c3c', ribbonColor: '#c0392b', icon: '💐', message: 'A beautiful bouquet for a beautiful person! 💐' },
    { id: 2, title: 'A Cuddly Surprise', description: 'Something soft and cute!', type: 'teddy', image: '/assets/gifts/teddy.png', color: '#9b59b6', ribbonColor: '#8e44ad', icon: '🧸', message: 'A little teddy to keep you company! 🧸' },
    { id: 3, title: 'The Ultimate Surprise', description: 'You know who it is! 😂', type: 'sampoornesh_babu', image: '/assets/photos/sampoornesh-babu.jpeg', color: '#f39c12', ribbonColor: '#d68910', icon: '👑', message: 'THE LEGEND HIMSELF! Sampoornesh Babu! 😂👑' },
  ],
  giftInteraction: {
    onlyOptionMessage: 'You have only one option now, and that is YES.',
    privacyNote: 'Your address will be sent to the birthday host terminal for delivery. Only enter it if you are comfortable sharing it.',
    deliveryEndpoint: '/api/delivery-address',
    requireAllGiftsOpened: true, question: 'Can I get your address for sending the gifts? 🎁', yesButton: 'YES ❤️', noButton: 'NO 🙃',
    addressInput: { enabled: true, placeholder: 'Enter your delivery address...', submitButton: 'Send', required: true, successMessage: 'Thank you so much... Your gifts will reach you shortly! ❤️' },
    noButtonBehavior: { enabled: true, maxAttempts: 5, message: 'Try again with the best answer! 😂', yesButtonScaleIncrement: 0.2, noButtonScaleDecrement: 0.2, removeNoButtonAfterMaxAttempts: true, keepYesButtonVisible: true },
  },
  audio: {
    backgroundMusic: '/assets/sounds/KUSHI.mp3.mpeg',
    startAfterPassword: true,
    autoplay: false,
    fadeIn: true,
    fadeInDuration: 2000,
    loop: true,
    showMuteButton: true,
    musicVolume: 0.4,
    sfxVolume: 0.6,
    sounds: {
      shutter: '/assets/sounds/camera-shutter.mp3.mpeg',
      blow: '/assets/sounds/blow.mp3',
      clap: '/assets/sounds/clap.mp3',
      unwrap: '/assets/sounds/christmas-present-451854.mp3.mpeg',
      celebrate: '/assets/sounds/celebrate.mp3',
      click: '/assets/sounds/click.mp3',
    },
  },
  sections: { welcome: true, camera: true, cake: true, memories: false, gifts: true, delivery: true, birthdayLetter: false, finale: false },
};

export default birthdayConfig;
