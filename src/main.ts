import CameraManager from "./CameraManager"
import FaceDetector from "./FaceDetector"
import maskImageUrl from "./mask.png"


async function main() {

  const maskImage = await new Promise<HTMLImageElement>((resolve) => {
    const img = new Image()
    img.onload = () => resolve(img) 
    img.src = maskImageUrl
  })

  const mainCanvas = document.createElement("canvas")
  const mainContext = mainCanvas.getContext("2d")!
  document.body.appendChild(mainCanvas)

  const cameraManager = new CameraManager()
  await cameraManager.start()
  const video = cameraManager.getVideo()

  mainCanvas.width = video.videoWidth
  mainCanvas.height = video.videoHeight

  const detector = new FaceDetector()
  await detector.init()

  const loop = async () => {
    const video = cameraManager.getVideo()
    const faces = await detector.estimate(video)
    mainContext.drawImage(video, 0, 0, mainCanvas.width, mainCanvas.height)
    faces.forEach(face => {
      mainContext.fillStyle = "red"
      mainContext.beginPath()
      const width = face.bottomRight[0] - face.topLeft[0]
      const height = face.bottomRight[1] - face.topLeft[1]
      const x = face.topLeft[0]
      const y = face.topLeft[1]
      const rateX = 0.3
      const rateY = 0.4
      mainContext.drawImage(maskImage, x - width * rateX, y - height * rateY, width * (1 + rateX), height * (1 + rateY))
    })
    requestAnimationFrame(loop)
  }
  requestAnimationFrame(loop)
}
main()