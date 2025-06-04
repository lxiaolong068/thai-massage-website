import { CopilotRuntime, GoogleGenerativeAIAdapter } from '@copilotkit/runtime';
import { NextRequest } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// 初始化Google Generative AI客户端
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

// 创建CopilotKit运行时
const copilotKit = new CopilotRuntime({
  actions: () => {
    return [
      {
        name: "getAvailableTimeSlots",
        description: "获取指定日期和按摩师的可用时间段",
        parameters: [
          {
            name: "date",
            type: "string",
            description: "查询日期 (YYYY-MM-DD格式)",
            required: true,
          },
          {
            name: "therapistId",
            type: "string",
            description: "按摩师ID",
            required: false,
          },
        ],
        handler: async ({ date, therapistId }) => {
          try {
            const url = new URL('/api/bookings/available-slots', process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000');
            url.searchParams.append('date', date);
            if (therapistId) {
              url.searchParams.append('therapistId', therapistId);
            }

            const response = await fetch(url.toString());
            const data = await response.json();
            
            if (data.success) {
              return {
                success: true,
                availableSlots: data.data,
                message: `${date}的可用时间段已获取`
              };
            } else {
              return {
                success: false,
                message: data.message || '获取可用时间段失败'
              };
            }
          } catch (error) {
            console.error('获取可用时间段失败:', error);
            return {
              success: false,
              message: '获取可用时间段时发生错误'
            };
          }
        },
      },
      {
        name: "checkServiceAvailability",
        description: "检查特定服务的可用性和详细信息",
        parameters: [
          {
            name: "serviceId",
            type: "string",
            description: "服务ID",
            required: true,
          },
        ],
        handler: async ({ serviceId }) => {
          try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/services/${serviceId}`);
            const data = await response.json();
            
            if (data.success) {
              return {
                success: true,
                service: data.data,
                message: `服务信息已获取：${data.data.name}`
              };
            } else {
              return {
                success: false,
                message: '服务不存在或不可用'
              };
            }
          } catch (error) {
            console.error('检查服务可用性失败:', error);
            return {
              success: false,
              message: '检查服务可用性时发生错误'
            };
          }
        },
      },
      {
        name: "getTherapistSchedule",
        description: "获取按摩师的工作时间表和可用性",
        parameters: [
          {
            name: "therapistId",
            type: "string",
            description: "按摩师ID",
            required: true,
          },
          {
            name: "startDate",
            type: "string",
            description: "查询开始日期 (YYYY-MM-DD格式)",
            required: false,
          },
          {
            name: "endDate",
            type: "string",
            description: "查询结束日期 (YYYY-MM-DD格式)",
            required: false,
          },
        ],
        handler: async ({ therapistId, startDate, endDate }) => {
          try {
            const url = new URL(`/api/therapists/${therapistId}/schedule`, process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000');
            if (startDate) url.searchParams.append('startDate', startDate);
            if (endDate) url.searchParams.append('endDate', endDate);

            const response = await fetch(url.toString());
            const data = await response.json();
            
            if (data.success) {
              return {
                success: true,
                schedule: data.data,
                message: `按摩师时间表已获取`
              };
            } else {
              return {
                success: false,
                message: data.message || '获取按摩师时间表失败'
              };
            }
          } catch (error) {
            console.error('获取按摩师时间表失败:', error);
            return {
              success: false,
              message: '获取按摩师时间表时发生错误'
            };
          }
        },
      },
      {
        name: "validateBookingData",
        description: "验证预约数据的完整性和有效性",
        parameters: [
          {
            name: "bookingData",
            type: "object",
            description: "预约数据对象",
            required: true,
          },
        ],
        handler: async ({ bookingData }) => {
          try {
            const requiredFields = ['serviceId', 'therapistId', 'date', 'time', 'name', 'phone'];
            const missingFields = requiredFields.filter(field => !bookingData[field]);
            
            if (missingFields.length > 0) {
              return {
                success: false,
                message: `缺少必填信息：${missingFields.join('、')}`,
                missingFields
              };
            }

            // 验证日期格式
            const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
            const timeRegex = /^\d{2}:\d{2}$/;
            
            if (!dateRegex.test(bookingData.date)) {
              return {
                success: false,
                message: '日期格式不正确，请使用YYYY-MM-DD格式'
              };
            }

            if (!timeRegex.test(bookingData.time)) {
              return {
                success: false,
                message: '时间格式不正确，请使用HH:mm格式'
              };
            }

            // 验证电话号码
            const phoneRegex = /^1[3-9]\d{9}$/;
            if (!phoneRegex.test(bookingData.phone)) {
              return {
                success: false,
                message: '电话号码格式不正确，请输入11位手机号码'
              };
            }

            // 验证邮箱（如果提供）
            if (bookingData.email) {
              const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
              if (!emailRegex.test(bookingData.email)) {
                return {
                  success: false,
                  message: '邮箱格式不正确'
                };
              }
            }

            return {
              success: true,
              message: '预约数据验证通过',
              data: bookingData
            };
          } catch (error) {
            console.error('验证预约数据失败:', error);
            return {
              success: false,
              message: '验证预约数据时发生错误'
            };
          }
        },
      },
    ];
  },
});

// 处理POST请求
export async function POST(req: NextRequest) {
  try {
    const { handleRequest } = copilotKit;
    return handleRequest(req, new GoogleGenerativeAIAdapter({ model }));
  } catch (error) {
    console.error('CopilotKit API错误:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}