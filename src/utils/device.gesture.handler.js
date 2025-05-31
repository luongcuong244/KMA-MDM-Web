export class DeviceGestureHandler {
    constructor(videoElement, fullScreenDeviceWidth, fullScreenDeviceHeight) {
        this.videoElement = videoElement;

        this.fullScreenDeviceWidth = fullScreenDeviceWidth;
        this.fullScreenDeviceHeight = fullScreenDeviceHeight;

        this.videoElement.addEventListener('click', this.handleClick.bind(this));
        // this.videoElement.addEventListener('touchstart', this.handleTouchStart.bind(this));
        // this.videoElement.addEventListener('touchend', this.handleTouchEnd.bind(this));

        this.touchStartX = 0;
        this.touchStartY = 0;
        this.touchStartTime = 0;
        this.swipeMaxDuration = 500; // Giới hạn thời gian vuốt (ms)
    }

    setOnClick(onClick) {
        this.onClick = onClick;
    }

    setOnDoubleClick(onDoubleClick) {
        this.onDoubleClick = onDoubleClick;
    }

    setOnLongPress(onLongPress) {
        this.onLongPress = onLongPress;
    }

    setOnSwipe(onSwipe) {
        this.onSwipe = onSwipe;
    }

    handleClick(e) {
        var deviceCoordinate = this.webCordianteToDeviceCoordinate(e.clientX, e.clientY);

        if (deviceCoordinate.x < 0 || deviceCoordinate.x > this.fullScreenDeviceWidth ||
            deviceCoordinate.y < 0 || deviceCoordinate.y > this.fullScreenDeviceHeight) {
            console.log("Click outside of the device area, ignoring.");
            return;
        }

        if (this.onClick) {
            this.onClick(deviceCoordinate.x, deviceCoordinate.y);
        }
    }

    handleTouchStart(e) {
        console.log("Touch start.");
        this.touchStartX = e.touches[0].clientX;
        this.touchStartY = e.touches[0].clientY;
        this.touchStartTime = Date.now(); // Ghi lại thời điểm bắt đầu chạm
    }

    handleTouchEnd(e) {
        let touchEndX = e.changedTouches[0].clientX;
        let touchEndY = e.changedTouches[0].clientY;
        let touchDuration = Date.now() - this.touchStartTime; // Thời gian diễn ra vuốt

        // Nếu vuốt mất quá lâu, bỏ qua
        if (touchDuration > this.swipeMaxDuration) {
            console.log("Vuốt quá lâu, không phải swipe hợp lệ.");
            return;
        }

        let diffX = touchEndX - this.touchStartX;
        let diffY = touchEndY - this.touchStartY;

        let direction = null;
        if (Math.abs(diffX) > Math.abs(diffY)) {
            if (diffX > 30) {
                direction = "right";
            } else if (diffX < -30) {
                direction = "left";
            }
        } else {
            if (diffY > 30) {
                direction = "down";
            } else if (diffY < -30) {
                direction = "up";
            }
        }

        console.log("direction: ", direction);

        if (direction && this.onSwipe) {
            console.log("Swipe detected.");
            this.onSwipe(this.webCordianteToDeviceCoordinate(this.touchStartX, this.touchStartY), this.webCordianteToDeviceCoordinate(touchEndX, touchEndY), touchDuration);
        }
    }

    webCordianteToDeviceCoordinate(x, y) {
        var videoWidth = this.videoElement.offsetWidth;
        var videoHeight = this.videoElement.offsetHeight;

        var displayDeviceWidth = this.fullScreenDeviceWidth / this.fullScreenDeviceHeight * videoHeight;
        var displayDeviceHeight = videoHeight;

        var xOnDisplayDevice = x - (videoWidth - displayDeviceWidth) / 2;
        var yOnDisplayDevice = y;

        var xOnDevice = xOnDisplayDevice / displayDeviceWidth * this.fullScreenDeviceWidth;
        var yOnDevice = yOnDisplayDevice / displayDeviceHeight * this.fullScreenDeviceHeight;

        return { x: xOnDevice, y: yOnDevice };
    }

    clearAllListeners() {
        this.videoElement.removeEventListener('click', this.handleClick.bind(this));
        // this.videoElement.removeEventListener('touchstart', this.handleTouchStart.bind(this));
        // this.videoElement.removeEventListener('touchend', this.handleTouchEnd.bind(this));
    }
}