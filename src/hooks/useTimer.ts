import { ref } from 'vue';

export const useTimer = () => {
    let timer: number = 0
    const time = ref(0)

    const startInterval = () => {
        stopInterval()
        time.value = 0
        timer = window.setInterval(() => {
            time.value++
        }, 100)
    }

    const stopInterval = () => {
        clearInterval(timer)
    }

    return { time, startInterval, stopInterval }
}
