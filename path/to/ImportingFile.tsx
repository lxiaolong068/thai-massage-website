// 如果是默认导出，使用默认导入
import YourComponent from './YourComponent';

// 如果是命名导出，使用命名导入
import { YourComponent } from './YourComponent';

// 不要混淆两种方式
// 错误示例: import YourComponent from './YourComponent' (当YourComponent是命名导出时) 