import "@tensorflow/tfjs-backend-webgl"
import { BlazeFaceModel, load } from "@tensorflow-models/blazeface"
import * as tf from "@tensorflow/tfjs-core"

export default class FaceDetector {

  #model: BlazeFaceModel | null = null

  async init() {
    await tf.setBackend("webgl")
    this.#model = await load()
  }

  async estimate(input: HTMLVideoElement) {
    if (!this.#model) {
      throw new Error("No model, please init first")
    }
    return await this.#model.estimateFaces(input)
  }
}