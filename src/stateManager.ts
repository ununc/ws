import fs from "fs/promises";
import path from "path";
import { AppState } from "./types";

export class StateManager {
  private readonly filePath: string;
  private currentState: AppState;

  constructor() {
    this.filePath = path.join(process.cwd(), "data", "state.json");
    this.currentState = {
      sections: [],
      items: [],
      lastUpdated: Date.now(),
    };
  }

  public async initialize(): Promise<void> {
    try {
      // data 디렉토리 생성
      await fs.mkdir(path.dirname(this.filePath), { recursive: true });

      try {
        const data = await fs.readFile(this.filePath, "utf-8");
        this.currentState = JSON.parse(data);
      } catch (error) {
        // 파일이 없는 경우 초기 상태 생성
        const initialState: AppState = {
          sections: [
            { id: 1, title: "김민경", items: [] },
            { id: 2, title: "신현교", items: [] },
            { id: 3, title: "김정민", items: [] },
            { id: 4, title: "강성전", items: [] },
            { id: 5, title: "주효민", items: [] },
            { id: 7, title: "최우형", items: [] },
            { id: 8, title: "염기현", items: [] },
          ],
          items: [
            { id: 1, name: "이세화" },
            { id: 2, name: "정여진" },
            { id: 3, name: "김유태" },
            { id: 4, name: "여민구" },
            { id: 5, name: "김영욱" },
            { id: 6, name: "이경은" },
            { id: 7, name: "이준영" },
            { id: 8, name: "신성민" },
            { id: 9, name: "김선아" },
            { id: 10, name: "김혜린" },
            { id: 11, name: "김명진" },
            { id: 12, name: "최한길" },
            { id: 13, name: "김준영" },
            { id: 14, name: "채정훈" },
            { id: 15, name: "김태진" },
            { id: 16, name: "윤병진" },
            { id: 17, name: "이청관" },
            { id: 18, name: "김수아" },
            { id: 19, name: "이예은" },
            { id: 20, name: "국축복" },
            { id: 21, name: "조효진" },
            { id: 22, name: "원소연" },
            { id: 23, name: "최아연" },
            { id: 24, name: "이정민" },
            { id: 25, name: "양승혁" },
            { id: 26, name: "정의진" },
            { id: 27, name: "이민석" },
            { id: 28, name: "황청환" },
            { id: 29, name: "장병찬" },
            { id: 30, name: "박미연" },
            { id: 31, name: "차선호" },
            { id: 32, name: "고다윗" },
            { id: 33, name: "이찬호(혜선)" },
            { id: 34, name: "박상호" },
            { id: 35, name: "염기현" },
            { id: 36, name: "최선호" },
            { id: 37, name: "김현진" },
            { id: 38, name: "김예지" },
            { id: 39, name: "고예진" },
            { id: 40, name: "임하은" },
            { id: 41, name: "김혜원" },
            { id: 42, name: "조성용" },
            { id: 43, name: "김온유" },
            { id: 44, name: "유재홍" },
            { id: 45, name: "김지선" },
            { id: 46, name: "김상민" },
            { id: 47, name: "유진호" },
            { id: 48, name: "주은혜" },
            { id: 49, name: "권귀성" },
            { id: 50, name: "김재준" },
            { id: 51, name: "진기성" },
            { id: 52, name: "이용환" },
            { id: 53, name: "최선미" },
            { id: 54, name: "서한나" },
            { id: 55, name: "김조경" },
            { id: 56, name: "김초롱" },
            { id: 57, name: "서민지" },
            { id: 58, name: "최민서" },
            { id: 59, name: "서희원" },
            { id: 60, name: "박지성" },
            { id: 61, name: "김현지" },
            { id: 62, name: "이주찬" },
            { id: 63, name: "이하은" },
            { id: 64, name: "장승호" },
            { id: 65, name: "조병학" },
            { id: 66, name: "차지원" },
            { id: 67, name: "김민은" },
            { id: 68, name: "박재형" },
            { id: 69, name: "박찬" },
            { id: 70, name: "오윤식" },
            { id: 71, name: "김휴" },
            { id: 72, name: "최우철" },
          ],
          lastUpdated: Date.now(),
        };

        await this.saveState(initialState);
      }
    } catch (error) {
      console.error("Failed to initialize state:", error);
    }
  }

  public async saveState(state: AppState): Promise<void> {
    try {
      this.currentState = {
        ...state,
        lastUpdated: Date.now(),
      };

      await fs.writeFile(
        this.filePath,
        JSON.stringify(this.currentState, null, 2),
        "utf-8"
      );
      console.log("State saved successfully");
    } catch (error) {
      console.error("Failed to save state:", error);
    }
  }

  public getState(): AppState {
    return this.currentState;
  }
}
