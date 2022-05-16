import CameraManager from "./CameraManager"
import FaceDetector from "./FaceDetector"


async function main() {
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
    console.log(faces)
    mainContext.drawImage(video, 0, 0, mainCanvas.width, mainCanvas.height)
    faces.forEach(face => {
      mainContext.fillStyle = "red"
      mainContext.beginPath()
      const x = face.topLeft[0]
      const y = face.topLeft[1]
      const width = face.bottomRight[0] - face.topLeft[0]
      const height = face.bottomRight[1] - face.topLeft[1]
      mainContext.ellipse(x + width / 2, y + height / 2, width / 2, height / 2, 0, 0, 2 * Math.PI)
      mainContext.fill()
    })
    requestAnimationFrame(loop)
  }
  requestAnimationFrame(loop)
}
main()