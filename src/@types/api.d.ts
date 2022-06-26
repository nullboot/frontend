declare namespace Components {
  namespace Schemas {
    export interface AddTagRequestDto {
      divisionId?: number;
      divisionName?: string;
      cityId?: number;
      cityName?: string;
    }
    export interface AddTagResponseDto {
      error?: string;
      city?: CityDto;
      division?: DivisionDto;
    }
    export interface AddUserRequestDto {
      /**
       * 用户Id
       * example:
       * 1
       */
      id: number;
      /**
       * 用户名
       * example:
       * admin
       */
      username: string;
      /**
       * 真实姓名
       * example:
       * admin
       */
      realname?: string;
      /**
       * 邮箱
       * example:
       * admin@null.boot
       */
      email: string;
      /**
       * 是否公开邮箱
       * example:
       * true
       */
      publicEmail?: boolean;
      /**
       * 是否为根管理员
       * example:
       * false
       */
      isRoot?: boolean;
      /**
       * 密码（明文）
       * example:
       * 123456
       */
      password: string;
      /**
       * 部门Id
       * example:
       * 1
       */
      divisionId?: number;
      /**
       * 城市Id
       * example:
       * 1
       */
      cityId?: number;
    }
    export interface AddUserResponseDto {
      /**
       * 用户信息
       */
      profile?: {
        id: number;
        username: string;
        realname: string;
        email: string;
        publicEmail: boolean;
        isRoot: boolean;
        registerTime: string; // date-time
        roles: ("NEWBIE" | "TUTOR" | "HRBP" | "ADMIN")[];
        city: CityDto;
        division: DivisionDto;
      };
      /**
       * 明文密码
       */
      password?: string;
      /**
       * 错误信息
       */
      error?: string;
    }
    export interface ApproveTutorRequestDto {
      approve: boolean;
    }
    export interface ApproveTutorResponseDto {
      error?: "PERMISSION_DENIED" | "NO_SUCH_TUTOR" | "ALREADY_APPROVED" | "ALREADY_REJECTED";
      profile?: TutorProfileDto;
    }
    export interface ArrayData {
      name?: string;
      data?: any[][];
    }
    export interface AssignNewbieTutorRequestDto {
      tutorId: number;
    }
    export interface AssignNewbieTutorResponseDto {
      error?: "PERMISSION_DENIED" | "NO_SUCH_NEWBIE" | "NO_SUCH_TUTOR" | "TUTOR_NOT_GRADUATE" | "NEWBIE_IS_ASSIGNED";
      profile?: NewbieProfileDto;
    }
    export interface CityDto {
      id: number;
      name: string;
    }
    export interface CourseBriefDto {
      /**
       * 课程Id
       */
      id: number;
      /**
       * 标题
       */
      title: string;
      /**
       * 详情
       */
      description: string;
      /**
       * 标签列表
       */
      tags: string[];
      /**
       * 创建者信息
       */
      ownerProfile: {
        id: number;
        username: string;
        realname: string;
        email: string;
        publicEmail: boolean;
        isRoot: boolean;
        registerTime: string; // date-time
        roles: ("NEWBIE" | "TUTOR" | "HRBP" | "ADMIN")[];
        city: CityDto;
        division: DivisionDto;
      };
      /**
       * 是否被使用
       */
      isUsed: boolean;
      sectionCount: number;
    }
    export interface CourseDto {
      /**
       * 课程Id
       */
      id: number;
      /**
       * 标题
       */
      title: string;
      /**
       * 详情
       */
      description: string;
      /**
       * 标签列表
       */
      tags: string[];
      /**
       * 创建者信息
       */
      ownerProfile: {
        id: number;
        username: string;
        realname: string;
        email: string;
        publicEmail: boolean;
        isRoot: boolean;
        registerTime: string; // date-time
        roles: ("NEWBIE" | "TUTOR" | "HRBP" | "ADMIN")[];
        city: CityDto;
        division: DivisionDto;
      };
      /**
       * 是否被使用
       */
      isUsed: boolean;
      sections: CourseSectionDto[];
    }
    export interface CourseForTraineeDto {
      title: string;
      description: string;
      tags: string[];
      isOptional: boolean;
      day: number;
      sections: CourseSectionForTraineeDto[];
      finished: boolean;
    }
    export interface CourseRequestDto {
      title: string;
      description: string;
      tags: string[];
      sectionIds: number[];
    }
    export interface CourseSectionDto {
      /**
       * 课程章节Id
       */
      id: number;
      /**
       * 标题
       */
      title: string;
      /**
       * 详情
       */
      description: string;
      /**
       * 类型（视频|课件）
       */
      type: "video" | "slides";
      /**
       * 文件名
       */
      filename: string;
      /**
       * 文件信息
       */
      fileInfo: {
        id: number;
        uuid: string;
        size: number;
        downloadLink: string;
        uploadTime: string; // date-time
      };
      /**
       * 是否被使用
       */
      isUsed: boolean;
    }
    export interface CourseSectionForTraineeDto {
      /**
       * 标题
       */
      title: string;
      /**
       * 详情
       */
      description: string;
      /**
       * 类型（视频|课件）
       */
      type: "video" | "slides";
      /**
       * 文件名
       */
      filename: string;
      /**
       * 下载链接
       */
      downloadLink: string;
      /**
       * 是否完成
       */
      finished: boolean;
    }
    export interface CourseSectionRequestDto {
      /**
       * 标题
       */
      title: string;
      /**
       * 详情
       */
      description: string;
      /**
       * 类型（视频|课件）
       */
      type: "video" | "slides";
      /**
       * 文件名
       */
      filename: string;
      /**
       * 文件Id
       */
      fileId: number;
    }
    export interface CreateCityRequestDto {
      name: string;
    }
    export interface CreateCityResponseDto {
      error?: "PERMISSION_DENIED" | "DUPLICATE_CITY_NAME";
      city?: CityDto;
    }
    export interface CreateCourseResponseDto {
      /**
       * 错误信息
       */
      error?: "PERMISSION_DENIED" | "INVALID_SECTION";
      /**
       * 课程信息
       */
      course?: {
        /**
         * 课程Id
         */
        id: number;
        /**
         * 标题
         */
        title: string;
        /**
         * 详情
         */
        description: string;
        /**
         * 标签列表
         */
        tags: string[];
        /**
         * 创建者信息
         */
        ownerProfile: {
          id: number;
          username: string;
          realname: string;
          email: string;
          publicEmail: boolean;
          isRoot: boolean;
          registerTime: string; // date-time
          roles: ("NEWBIE" | "TUTOR" | "HRBP" | "ADMIN")[];
          city: CityDto;
          division: DivisionDto;
        };
        /**
         * 是否被使用
         */
        isUsed: boolean;
        sections: CourseSectionDto[];
      };
    }
    export interface CreateCourseSectionResponseDto {
      /**
       * 错误信息
       */
      error?: "PERMISSION_DENIED" | "NO_SUCH_FILE";
      /**
       * 章节信息
       */
      section?: {
        /**
         * 课程章节Id
         */
        id: number;
        /**
         * 标题
         */
        title: string;
        /**
         * 详情
         */
        description: string;
        /**
         * 类型（视频|课件）
         */
        type: "video" | "slides";
        /**
         * 文件名
         */
        filename: string;
        /**
         * 文件信息
         */
        fileInfo: {
          id: number;
          uuid: string;
          size: number;
          downloadLink: string;
          uploadTime: string; // date-time
        };
        /**
         * 是否被使用
         */
        isUsed: boolean;
      };
    }
    export interface CreateDivisionRequestDto {
      name: string;
    }
    export interface CreateDivisionResponseDto {
      error?: "PERMISSION_DENIED" | "DUPLICATE_DIVISION_NAME";
      division?: DivisionDto;
    }
    export interface CreateExamRequestDto {
      title: string;
      description: string;
      tags: string[];
      problems: ProblemRequestDto[];
    }
    export interface CreateExamResponseDto {
      error?: "PERMISSION_DENIED" | "INVALID_ANSWER";
      exam?: ExamDto;
    }
    export interface CreateTaskRequestDto {
      title: string;
      description: string;
      tags: string[];
    }
    export interface CreateTaskResponseDto {
      error?: "PERMISSION_DENIED";
      task?: TaskDto;
    }
    export interface CreateUserRequestDto {
      username: string;
      realname: string;
      email: string;
      publicEmail: boolean;
      roles: ("NEWBIE" | "TUTOR" | "HRBP" | "ADMIN")[];
      password: string;
      cityId?: number;
      divisionId: number;
    }
    export interface CreateUserResponseDto {
      error?: "PERMISSION_DENIED" | "DUPLICATE_EMAIL" | "DUPLICATE_USERNAME" | "INVALID_CITY" | "INVALID_DIVISION";
      profile?: UserProfileDto;
    }
    export interface DeleteCityResponseDto {
      error?: "PERMISSION_DENIED" | "NO_SUCH_CITY";
    }
    export interface DeleteCourseResponseDto {
      /**
       * 错误信息
       */
      error?: "PERMISSION_DENIED" | "NO_SUCH_COURSE" | "ALREADY_USED";
    }
    export interface DeleteCourseSectionResponseDto {
      /**
       * 错误信息
       */
      error?: "PERMISSION_DENIED" | "NO_SUCH_SECTION" | "ALREADY_USED";
    }
    export interface DeleteDivisionResponseDto {
      error?: "PERMISSION_DENIED" | "NO_SUCH_DIVISION" | "DIVISION_NOT_EMPTY";
    }
    export interface DeleteExamResponseDto {
      error?: "PERMISSION_DENIED" | "NO_SUCH_EXAM" | "ALREADY_USED";
    }
    export interface DeleteNewbieCommentResponseDto {
      error?: "PERMISSION_DENIED" | "NO_SUCH_NEWBIE" | "NO_SUCH_COMMENT";
    }
    export interface DeleteTaskResponseDto {
      error?: "PERMISSION_DENIED" | "NO_SUCH_TASK" | "ALREADY_USED";
    }
    export interface DivisionDto {
      id: number;
      name: string;
    }
    export interface DoneFileUploadRequestDto {
      uuid: string;
      size: number;
    }
    export interface DoneFileUploadResponseDto {
      error?: "PERMISSION_DENIED" | "FILE_UUID_EXISTS" | "FILE_NOT_UPLOADED";
      fileInfo?: FileInfoDto;
    }
    export interface ExamAnswersRequestDto {
      answers: number[];
    }
    export interface ExamAnswersResponseDto {
      isCorrect: boolean;
      answers: number[];
      reason: string;
    }
    export interface ExamDto {
      title: string;
      description: string;
      tags: string[];
      id: number;
      problems: ProblemDto[];
      ownerProfile: UserProfileDto;
      isUsed: boolean;
    }
    export interface ExamForTraineeDto {
      title: string;
      description: string;
      tags: string[];
      problems: ProblemWithoutAnswersDto[];
      day: number;
      finished: boolean;
    }
    export interface FileInfoDto {
      id: number;
      uuid: string;
      size: number;
      downloadLink: string;
      uploadTime: string; // date-time
    }
    export interface GetAwardResponseDto {
      error?: "PERMISSION_DENIED" | "NO_SUCH_TUTOR";
      awards?: TutorAwardDto[];
    }
    export interface GetCitiesResponseDto {
      error?: "PERMISSION_DENIED";
      cities?: CityDto[];
    }
    export interface GetCityResponseDto {
      error?: "PERMISSION_DENIED" | "NO_SUCH_CITY";
      city?: CityDto;
    }
    export interface GetCourseResponseDto {
      /**
       * 错误信息
       */
      error?: "PERMISSION_DENIED" | "NO_SUCH_COURSE";
      /**
       * 课程信息
       */
      course?: {
        /**
         * 课程Id
         */
        id: number;
        /**
         * 标题
         */
        title: string;
        /**
         * 详情
         */
        description: string;
        /**
         * 标签列表
         */
        tags: string[];
        /**
         * 创建者信息
         */
        ownerProfile: {
          id: number;
          username: string;
          realname: string;
          email: string;
          publicEmail: boolean;
          isRoot: boolean;
          registerTime: string; // date-time
          roles: ("NEWBIE" | "TUTOR" | "HRBP" | "ADMIN")[];
          city: CityDto;
          division: DivisionDto;
        };
        /**
         * 是否被使用
         */
        isUsed: boolean;
        sections: CourseSectionDto[];
      };
    }
    export interface GetCourseSectionResponseDto {
      /**
       * 错误信息
       */
      error?: "PERMISSION_DENIED" | "NO_SUCH_SECTION";
      /**
       * 章节信息
       */
      section?: {
        /**
         * 课程章节Id
         */
        id: number;
        /**
         * 标题
         */
        title: string;
        /**
         * 详情
         */
        description: string;
        /**
         * 类型（视频|课件）
         */
        type: "video" | "slides";
        /**
         * 文件名
         */
        filename: string;
        /**
         * 文件信息
         */
        fileInfo: {
          id: number;
          uuid: string;
          size: number;
          downloadLink: string;
          uploadTime: string; // date-time
        };
        /**
         * 是否被使用
         */
        isUsed: boolean;
      };
    }
    export interface GetCourseSectionsResponseDto {
      /**
       * 总项数
       */
      count?: number;
      /**
       * 错误信息
       */
      error?: "PERMISSION_DENIED" | "TAKE_TOO_MANY";
      /**
       * 章节列表
       */
      sections?: CourseSectionDto[];
    }
    export interface GetCoursesResponseDto {
      /**
       * 总项数
       */
      count?: number;
      /**
       * 错误信息
       */
      error?: "PERMISSION_DENIED" | "NO_SUCH_USER" | "TAKE_TOO_MANY";
      /**
       * 课程列表
       */
      courses?: CourseBriefDto[];
    }
    export interface GetDivisionResponseDto {
      error?: "PERMISSION_DENIED" | "NO_SUCH_DIVISION";
      division?: DivisionDto;
    }
    export interface GetDivisionsResponseDto {
      error?: "PERMISSION_DENIED";
      divisions?: DivisionDto[];
    }
    export interface GetExamResponseDto {
      error?: "PERMISSION_DENIED" | "NO_SUCH_EXAM";
      exam?: ExamDto;
    }
    export interface GetExamsResponseDto {
      /**
       * 总项数
       */
      count?: number;
      error?: "PERMISSION_DENIED" | "NO_SUCH_USER" | "TAKE_TOO_MANY";
      exams?: ExamDto[];
    }
    export interface GetNewbieCommentResponseDto {
      error?: "PERMISSION_DENIED" | "NO_SUCH_NEWBIE" | "NO_SUCH_COMMENT" | "NEWBIE_NOT_ASSIGNED";
      comment?: NewbieCommentDto;
      comments?: NewbieCommentDto[];
    }
    export interface GetNewbieDataShowResponseDto {
      error?: "PERMISSION_DENIED" | "TAKE_TOO_MANY_MONTHS" | "INVALID_TIME_RANGE";
      basis?: ArrayData[];
      training?: ArrayData[];
      graduate?: ArrayData[];
      score?: NumberData[];
    }
    export interface GetNewbieProfileResponseDto {
      profile?: NewbieProfileDto;
      training?: TrainingDto;
      comment?: NewbieCommentDto;
      error?: "PERMISSION_DENIED" | "NO_SUCH_NEWBIE";
    }
    export interface GetNewbieTemplateResponseDto {
      error?: "PERMISSION_DENIED" | "NO_SUCH_NEWBIE" | "NO_TUTOR_ASSIGNED";
      template?: TemplateResponseDto;
    }
    export interface GetNewbiesResponseDto {
      /**
       * 总项数
       */
      count?: number;
      error?: "PERMISSION_DENIED" | "TAKE_TOO_MANY" | "NO_SUCH_TUTOR" | "INVALID_CITY" | "INVALID_DIVISION";
      newbies?: NewbieProfileDto[];
      comments?: NewbieCommentDto[];
    }
    export interface GetPermissionResponseDto {
      error?: "PERMISSION_DENIED" | "NO_SUCH_ADMIN" | "NO_SUCH_HRBP";
      divisions?: DivisionDto[];
    }
    export interface GetTaskResponseDto {
      error?: "PERMISSION_DENIED" | "NO_SUCH_TASK";
      task?: TaskDto;
    }
    export interface GetTasksResponseDto {
      /**
       * 总项数
       */
      count?: number;
      error?: "PERMISSION_DENIED" | "NO_SUCH_USER" | "TAKE_TOO_MANY";
      tasks?: TaskDto[];
    }
    export interface GetTemplateResponseDto {
      error?: "PERMISSION_DENIED" | "NO_SUCH_TEMPLATE";
      template?: TemplateResponseDto;
    }
    export interface GetTemplatesResponseDto {
      /**
       * 总项数
       */
      count?: number;
      error?: "PERMISSION_DENIED" | "TAKE_TOO_MANY";
      templates?: TemplateBriefResponseDto[];
    }
    export interface GetTutorDataShowResponseDto {
      error?: "PERMISSION_DENIED" | "TAKE_TOO_MANY_MONTHS" | "INVALID_TIME_RANGE";
      basis?: ArrayData[];
      approval?: ArrayData[];
      assignment?: ArrayData[];
      score?: NumberData[];
    }
    export interface GetTutorProfileResponseDto {
      profile?: TutorProfileDto;
      training?: TrainingDto;
      error?: "PERMISSION_DENIED" | "NO_SUCH_TUTOR";
    }
    export interface GetTutorsResponseDto {
      /**
       * 总项数
       */
      count?: number;
      error?: "PERMISSION_DENIED" | "TAKE_TOO_MANY" | "INVALID_CITY" | "INVALID_DIVISION";
      tutors?: TutorProfileDto[];
    }
    export interface GetUserProfileResponseDto {
      error?: "NO_SUCH_USER" | "PERMISSION_DENIED";
      profile?: UserProfileDto;
    }
    export interface GetUsersResponseDto {
      /**
       * 总项数
       */
      count?: number;
      error?: "PERMISSION_DENIED" | "TAKE_TOO_MANY" | "INVALID_CITY" | "INVALID_DIVISION";
      users?: UserProfileDto[];
    }
    export interface GiveAwardRequestDto {
      title: string;
      description?: string | null;
      level: number;
    }
    export interface GiveAwardResponseDto {
      error?: "PERMISSION_DENIED" | "NO_SUCH_TUTOR" | "NOT_GRADUATED";
      award?: TutorAwardDto;
      profile?: TutorProfileDto;
    }
    export interface LoginRequestDto {
      /**
       * 用户名
       */
      username?: string;
      /**
       * 邮箱
       */
      email?: string;
      /**
       * 密码
       */
      password: string;
    }
    export interface LoginResponseDto {
      /**
       * 错误信息
       */
      error?: "NO_SUCH_USER" | "WRONG_PASSWORD";
      /**
       * JSON Web Token
       */
      token?: string;
      /**
       * 用户信息
       */
      profile?: {
        id: number;
        username: string;
        realname: string;
        email: string;
        publicEmail: boolean;
        isRoot: boolean;
        registerTime: string; // date-time
        roles: ("NEWBIE" | "TUTOR" | "HRBP" | "ADMIN")[];
        city: CityDto;
        division: DivisionDto;
      };
    }
    export interface LogoutRequestDto {
      /**
       * 用户Id
       */
      userId: number;
    }
    export interface LogoutResponseDto {
      /**
       * 错误码
       */
      error?: "PERMISSION_DENIED" | "NOT_LOGIN" | "NO_SUCH_USER";
    }
    export interface NewbieCommentDto {
      id: number;
      content: string;
      score: number;
      updateTime: string; // date-time
    }
    export interface NewbieCommentRequestDto {
      content: string;
      score?: number;
      type: "NewbieToTutor" | "TutorToNewbie" | "TutorRecord";
      recordId?: number;
    }
    export interface NewbieProfileDto {
      userId: number;
      tutorProfile?: TutorProfileDto;
      graduationTime: string; // date-time
      assignedTime: string; // date-time
      isAssigned: boolean;
      isGraduate: boolean;
      onBoarding: boolean;
      examAverageScore?: number;
      userProfile: UserProfileDto;
    }
    export interface NominateTutorResponseDto {
      error?: "PERMISSION_DENIED" | "NO_SUCH_USER" | "ALREADY_NOMINATED";
      profile?: TutorProfileDto;
    }
    export interface NumberData {
      name?: string;
      data?: number;
    }
    export interface ParseExamCsvFileRequestDto {
      file: string; // binary
    }
    export interface ParseExamCsvFileResponseDto {
      error?: "PERMISSION_DENIED" | "INVALID_FILE_FORMAT";
      problems?: ProblemDto[];
    }
    export interface PostResponseDto {
      /**
       * 错误信息
       */
      error?: "NOT_LOGIN";
      /**
       * 用户信息
       */
      profile?: {
        id: number;
        username: string;
        realname: string;
        email: string;
        publicEmail: boolean;
        isRoot: boolean;
        registerTime: string; // date-time
        roles: ("NEWBIE" | "TUTOR" | "HRBP" | "ADMIN")[];
        city: CityDto;
        division: DivisionDto;
      };
    }
    export interface ProblemDto {
      title: string;
      options: string[];
      type: "SINGLE_CHOICE" | "MULTIPLE_CHOICE";
      answers: number[];
      reason: string;
    }
    export interface ProblemRequestDto {
      title: string;
      options: string[];
      type: "SINGLE_CHOICE" | "MULTIPLE_CHOICE";
      answers: number[];
      reason: string;
    }
    export interface ProblemWithoutAnswersDto {
      title: string;
      options: string[];
      type: "SINGLE_CHOICE" | "MULTIPLE_CHOICE";
    }
    export interface SetPermissionRequestDto {
      divisionIds: number[];
    }
    export interface SetPermissionResponseDto {
      error?: "PERMISSION_DENIED" | "NO_SUCH_ADMIN" | "NO_SUCH_HRBP" | "INVALID_DIVISION";
    }
    export interface SignFileUploadRequestDto {
      size: number;
    }
    export interface SignFileUploadResponseDto {
      error?: "PERMISSION_DENIED" | "FILE_TOO_LARGE";
      signedRequest?: SignedFileUploadRequestDto;
    }
    export interface SignedFileUploadRequestDto {
      uuid: string;
      url: string;
      extraFormData?: {
        [key: string]: any;
      };
      fileFieldName?: string;
    }
    export interface TaskDto {
      id: number;
      title: string;
      description: string;
      tags: string[];
      ownerProfile: UserProfileDto;
      isUsed: boolean;
    }
    export interface TaskForTraineeDto {
      title: string;
      description: string;
      tags: string[];
      day: number;
      finished: boolean;
    }
    export interface TemplateBriefResponseDto {
      type: "newbie" | "tutor";
      division: DivisionDto;
      examCount: number;
      taskCount: number;
      courseCount: number;
    }
    export interface TemplateCourseRequestDto {
      /**
       * 培训项Id
       */
      id: number;
      /**
       * 建议学习日期
       */
      day: number;
      /**
       * 标签列表
       */
      tags: string[];
      /**
       * 是否选修
       */
      isOptional: boolean;
    }
    export interface TemplateCourseResponseDto {
      id: number;
      day: number;
      tags: string[];
      title: string;
      description: string;
      isOptional: boolean;
    }
    export interface TemplateExamRequestDto {
      /**
       * 培训项Id
       */
      id: number;
      /**
       * 建议学习日期
       */
      day: number;
      /**
       * 标签列表
       */
      tags: string[];
    }
    export interface TemplateExamResponseDto {
      id: number;
      day: number;
      tags: string[];
      title: string;
      description: string;
    }
    export interface TemplateRequestDto {
      /**
       * 考试列表
       */
      exams: TemplateExamRequestDto[];
      /**
       * 任务列表
       */
      tasks: TemplateTaskRequestDto[];
      /**
       * 课程列表
       */
      courses: TemplateCourseRequestDto[];
    }
    export interface TemplateResponseDto {
      type: "newbie" | "tutor";
      division: DivisionDto;
      exams: TemplateExamResponseDto[];
      tasks: TemplateTaskResponseDto[];
      courses: TemplateCourseResponseDto[];
    }
    export interface TemplateTaskRequestDto {
      /**
       * 培训项Id
       */
      id: number;
      /**
       * 建议学习日期
       */
      day: number;
      /**
       * 标签列表
       */
      tags: string[];
    }
    export interface TemplateTaskResponseDto {
      id: number;
      day: number;
      tags: string[];
      title: string;
      description: string;
    }
    export interface TraineeGetCourseResponseDto {
      /**
       * 错误信息
       */
      error?: "PERMISSION_DENIED" | "NO_SUCH_NEWBIE" | "NO_SUCH_TUTOR" | "NO_SUCH_COURSE";
      /**
       * 课程信息
       */
      course?: {
        title: string;
        description: string;
        tags: string[];
        isOptional: boolean;
        day: number;
        sections: CourseSectionForTraineeDto[];
        finished: boolean;
      };
    }
    export interface TraineeGetExamResponseDto {
      error?: "PERMISSION_DENIED" | "NO_SUCH_NEWBIE" | "NO_SUCH_TUTOR" | "NO_SUCH_EXAM";
      exam?: ExamForTraineeDto;
    }
    export interface TraineeGetTaskResponseDto {
      error?: "PERMISSION_DENIED" | "NO_SUCH_NEWBIE" | "NO_SUCH_TUTOR" | "NO_SUCH_TASK";
      task?: TaskForTraineeDto;
    }
    export interface TraineeSubmitCourseSectionResponseDto {
      /**
       * 错误信息
       */
      error?: "PERMISSION_DENIED" | "NO_SUCH_NEWBIE" | "NO_SUCH_TUTOR" | "NO_SUCH_COURSE" | "NO_SUCH_SECTION";
    }
    export interface TraineeSubmitExamRequestDto {
      answers: ExamAnswersRequestDto[];
    }
    export interface TraineeSubmitExamResponseDto {
      error?:
        | "PERMISSION_DENIED"
        | "NO_SUCH_NEWBIE"
        | "NO_SUCH_TUTOR"
        | "NO_SUCH_EXAM"
        | "INVALID_ANSWER"
        | "INVALID_ANSWER_COUNT";
      passed?: boolean;
      results?: ExamAnswersResponseDto[];
    }
    export interface TraineeSubmitTaskResponseDto {
      error?: "PERMISSION_DENIED" | "NO_SUCH_TASK" | "NO_SUCH_TUTOR" | "NO_SUCH_NEWBIE";
    }
    export interface TrainingCourseDto {
      /**
       * 培训项Id
       */
      id: number;
      /**
       * 建议学习日期
       */
      day: number;
      /**
       * 标签列表
       */
      tags: string[];
      /**
       * 是否完成
       */
      finished: boolean;
      /**
       * 是否选修
       */
      isOptional: boolean;
      /**
       * 章节列表
       */
      sections: TrainingSectionDto[];
    }
    export interface TrainingDto {
      /**
       * 考试列表
       */
      exams: TrainingExamDto[];
      /**
       * 任务列表
       */
      tasks: TrainingTaskDto[];
      /**
       * 课程列表
       */
      courses: TrainingCourseDto[];
    }
    export interface TrainingExamDto {
      /**
       * 培训项Id
       */
      id: number;
      /**
       * 建议学习日期
       */
      day: number;
      /**
       * 标签列表
       */
      tags: string[];
      /**
       * 是否完成
       */
      finished: boolean;
      /**
       * 得分
       */
      score: number;
    }
    export interface TrainingSectionDto {
      /**
       * 章节Id
       */
      id: number;
      /**
       * 是否完成
       */
      finished: boolean;
    }
    export interface TrainingTaskDto {
      /**
       * 培训项Id
       */
      id: number;
      /**
       * 建议学习日期
       */
      day: number;
      /**
       * 标签列表
       */
      tags: string[];
      /**
       * 是否完成
       */
      finished: boolean;
    }
    export interface TutorAwardDto {
      id: number;
      title: string;
      description?: string;
      level: number;
      achieveTime: string; // date-time
    }
    export interface TutorProfileDto {
      userId: number;
      isApproved: boolean;
      nominateTime: string; // date-time
      approvedTime: string; // date-time
      totalScore: number;
      averageScore: number;
      graduateNewbieCount: number;
      totalNewbieCount: number;
      isGraduate: boolean;
      graduationTime: string; // date-time
      userProfile: UserProfileDto;
    }
    export interface UpdateCityRequestDto {
      name: string;
    }
    export interface UpdateCityResponseDto {
      error?: "PERMISSION_DENIED" | "NO_SUCH_CITY" | "DUPLICATE_CITY_NAME";
      city?: CityDto;
    }
    export interface UpdateCourseResponseDto {
      /**
       * 错误信息
       */
      error?: "PERMISSION_DENIED" | "NO_SUCH_COURSE" | "INVALID_SECTION";
      /**
       * 课程信息
       */
      course?: {
        /**
         * 课程Id
         */
        id: number;
        /**
         * 标题
         */
        title: string;
        /**
         * 详情
         */
        description: string;
        /**
         * 标签列表
         */
        tags: string[];
        /**
         * 创建者信息
         */
        ownerProfile: {
          id: number;
          username: string;
          realname: string;
          email: string;
          publicEmail: boolean;
          isRoot: boolean;
          registerTime: string; // date-time
          roles: ("NEWBIE" | "TUTOR" | "HRBP" | "ADMIN")[];
          city: CityDto;
          division: DivisionDto;
        };
        /**
         * 是否被使用
         */
        isUsed: boolean;
        sections: CourseSectionDto[];
      };
    }
    export interface UpdateCourseSectionResponseDto {
      /**
       * 错误信息
       */
      error?: "PERMISSION_DENIED" | "NO_SUCH_SECTION" | "NO_SUCH_FILE";
      /**
       * 章节信息
       */
      section?: {
        /**
         * 课程章节Id
         */
        id: number;
        /**
         * 标题
         */
        title: string;
        /**
         * 详情
         */
        description: string;
        /**
         * 类型（视频|课件）
         */
        type: "video" | "slides";
        /**
         * 文件名
         */
        filename: string;
        /**
         * 文件信息
         */
        fileInfo: {
          id: number;
          uuid: string;
          size: number;
          downloadLink: string;
          uploadTime: string; // date-time
        };
        /**
         * 是否被使用
         */
        isUsed: boolean;
      };
    }
    export interface UpdateDivisionRequestDto {
      name: string;
    }
    export interface UpdateDivisionResponseDto {
      error?: "PERMISSION_DENIED" | "NO_SUCH_DIVISION" | "DUPLICATE_DIVISION_NAME";
      division?: DivisionDto;
    }
    export interface UpdateExamRequestDto {
      title: string;
      description: string;
      tags: string[];
      problems: ProblemRequestDto[];
    }
    export interface UpdateExamResponseDto {
      error?: "PERMISSION_DENIED" | "NO_SUCH_EXAM" | "INVALID_ANSWER";
      exam?: ExamDto;
    }
    export interface UpdateNewbieCommentResponseDto {
      error?:
        | "PERMISSION_DENIED"
        | "NO_SUCH_NEWBIE"
        | "NEWBIE_NOT_ASSIGNED"
        | "NEWBIE_GRADUATED"
        | "NO_SUCH_RECORD"
        | "REQUIRE_SCORE";
      comment?: NewbieCommentDto;
      profile?: NewbieProfileDto;
    }
    export interface UpdateNewbieTemplateRequestDto {
      /**
       * 考试列表
       */
      exams: TemplateExamRequestDto[];
      /**
       * 任务列表
       */
      tasks: TemplateTaskRequestDto[];
      /**
       * 课程列表
       */
      courses: TemplateCourseRequestDto[];
      assignToNewbie?: boolean;
    }
    export interface UpdateNewbieTemplateResponseDto {
      error?:
        | "PERMISSION_DENIED"
        | "NO_SUCH_NEWBIE"
        | "NO_TUTOR_ASSIGNED"
        | "TRAINING_ASSIGNED"
        | "INVALID_EXAM"
        | "INVALID_TASK"
        | "INVALID_COURSE";
      template?: TemplateResponseDto;
    }
    export interface UpdatePasswordRequestDto {
      oldPassword?: string;
      password: string;
    }
    export interface UpdatePasswordResponseDto {
      error?: "PERMISSION_DENIED" | "NO_SUCH_USER" | "WRONG_OLD_PASSWORD";
    }
    export interface UpdateTaskRequestDto {
      title: string;
      description: string;
      tags: string[];
    }
    export interface UpdateTaskResponseDto {
      error?: "PERMISSION_DENIED" | "NO_SUCH_TASK";
      task?: TaskDto;
    }
    export interface UpdateTemplateResponseDto {
      error?: "PERMISSION_DENIED" | "NO_SUCH_TEMPLATE" | "INVALID_EXAM" | "INVALID_TASK" | "INVALID_COURSE";
      template?: TemplateResponseDto;
    }
    export interface UpdateUserProfileRequestDto {
      username?: string;
      email?: string;
      publicEmail?: boolean;
      realname?: string;
      divisionId?: number;
      cityId?: number;
    }
    export interface UpdateUserProfileResponseDto {
      error?:
        | "PERMISSION_DENIED"
        | "NO_SUCH_USER"
        | "DUPLICATE_EMAIL"
        | "DUPLICATE_USERNAME"
        | "INVALID_CITY"
        | "INVALID_DIVISION";
      profile?: UserProfileDto;
    }
    export interface UpdateUserRolesRequestDto {
      roles: ("NEWBIE" | "TUTOR" | "HRBP" | "ADMIN")[];
    }
    export interface UpdateUserRolesResponseDto {
      error?: "PERMISSION_DENIED" | "NO_SUCH_USER";
      profile?: UserProfileDto;
    }
    export interface UserProfileDto {
      id: number;
      username: string;
      realname: string;
      email: string;
      publicEmail: boolean;
      isRoot: boolean;
      registerTime: string; // date-time
      roles: ("NEWBIE" | "TUTOR" | "HRBP" | "ADMIN")[];
      city: CityDto;
      division: DivisionDto;
    }
  }
}
declare namespace Paths {
  namespace AuthControllerLogin {
    export type RequestBody = Components.Schemas.LoginRequestDto;
    namespace Responses {
      export type $201 = Components.Schemas.LoginResponseDto;
    }
  }
  namespace AuthControllerPost {
    namespace Responses {
      export type $201 = Components.Schemas.PostResponseDto;
    }
  }
  namespace AuthControllerPostLogout {
    export type RequestBody = Components.Schemas.LogoutRequestDto;
    namespace Responses {
      export type $201 = Components.Schemas.LogoutResponseDto;
    }
  }
  namespace CourseControllerCreateCourse {
    export type RequestBody = Components.Schemas.CourseRequestDto;
    namespace Responses {
      export type $201 = Components.Schemas.CreateCourseResponseDto;
    }
  }
  namespace CourseControllerCreateCourseSection {
    export type RequestBody = Components.Schemas.CourseSectionRequestDto;
    namespace Responses {
      export type $201 = Components.Schemas.CreateCourseSectionResponseDto;
    }
  }
  namespace CourseControllerDeleteCourse {
    namespace Parameters {
      export type Id = number;
    }
    export interface PathParameters {
      id: Parameters.Id;
    }
    namespace Responses {
      export type $200 = Components.Schemas.DeleteCourseResponseDto;
    }
  }
  namespace CourseControllerDeleteCourseSection {
    namespace Parameters {
      export type Id = number;
    }
    export interface PathParameters {
      id: Parameters.Id;
    }
    namespace Responses {
      export type $200 = Components.Schemas.DeleteCourseSectionResponseDto;
    }
  }
  namespace CourseControllerGetCourse {
    namespace Parameters {
      export type Id = number;
    }
    export interface PathParameters {
      id: Parameters.Id;
    }
    namespace Responses {
      export type $200 = Components.Schemas.GetCourseResponseDto;
    }
  }
  namespace CourseControllerGetCourseSection {
    namespace Parameters {
      export type Id = number;
    }
    export interface PathParameters {
      id: Parameters.Id;
    }
    namespace Responses {
      export type $200 = Components.Schemas.GetCourseSectionResponseDto;
    }
  }
  namespace CourseControllerGetCourseSections {
    namespace Parameters {
      export type CurrentRole = "NEWBIE" | "TUTOR" | "HRBP" | "ADMIN";
      export type Keyword = string;
      export type Skip = number;
      export type Take = number;
      export type Type = "video" | "slides";
      export type Wildcard = "BEGIN" | "END" | "BOTH" | "NONE";
    }
    export interface QueryParameters {
      skip?: Parameters.Skip;
      take: Parameters.Take;
      currentRole?: Parameters.CurrentRole;
      keyword?: Parameters.Keyword;
      wildcard?: Parameters.Wildcard;
      type?: Parameters.Type;
    }
    namespace Responses {
      export type $200 = Components.Schemas.GetCourseSectionsResponseDto;
    }
  }
  namespace CourseControllerGetCourses {
    namespace Parameters {
      export type CurrentRole = "NEWBIE" | "TUTOR" | "HRBP" | "ADMIN";
      export type Keyword = string;
      export type OwnerId = number;
      export type Skip = number;
      export type Tag = string;
      export type Take = number;
      export type Wildcard = "BEGIN" | "END" | "BOTH" | "NONE";
    }
    export interface QueryParameters {
      skip?: Parameters.Skip;
      take: Parameters.Take;
      currentRole?: Parameters.CurrentRole;
      ownerId?: Parameters.OwnerId;
      keyword?: Parameters.Keyword;
      wildcard?: Parameters.Wildcard;
      tag?: Parameters.Tag;
    }
    namespace Responses {
      export type $200 = Components.Schemas.GetCoursesResponseDto;
    }
  }
  namespace CourseControllerUpdateCourse {
    namespace Parameters {
      export type Id = number;
    }
    export interface PathParameters {
      id: Parameters.Id;
    }
    export type RequestBody = Components.Schemas.CourseRequestDto;
    namespace Responses {
      export type $201 = Components.Schemas.UpdateCourseResponseDto;
    }
  }
  namespace CourseControllerUpdateCourseSection {
    namespace Parameters {
      export type Id = number;
    }
    export interface PathParameters {
      id: Parameters.Id;
    }
    export type RequestBody = Components.Schemas.CourseSectionRequestDto;
    namespace Responses {
      export type $201 = Components.Schemas.UpdateCourseSectionResponseDto;
    }
  }
  namespace DevControllerAddTag {
    export type RequestBody = Components.Schemas.AddTagRequestDto;
    namespace Responses {
      export type $201 = Components.Schemas.AddTagResponseDto;
    }
  }
  namespace DevControllerAddUser {
    export type RequestBody = Components.Schemas.AddUserRequestDto;
    namespace Responses {
      export type $201 = Components.Schemas.AddUserResponseDto;
    }
  }
  namespace ExamControllerCreateExam {
    export type RequestBody = Components.Schemas.CreateExamRequestDto;
    namespace Responses {
      export type $201 = Components.Schemas.CreateExamResponseDto;
    }
  }
  namespace ExamControllerDeleteExam {
    namespace Parameters {
      export type Id = number;
    }
    export interface PathParameters {
      id: Parameters.Id;
    }
    namespace Responses {
      export type $200 = Components.Schemas.DeleteExamResponseDto;
    }
  }
  namespace ExamControllerGetExam {
    namespace Parameters {
      export type Id = number;
    }
    export interface PathParameters {
      id: Parameters.Id;
    }
    namespace Responses {
      export type $200 = Components.Schemas.GetExamResponseDto;
    }
  }
  namespace ExamControllerGetExamTemplate {
    namespace Responses {
      export interface $200 {}
    }
  }
  namespace ExamControllerGetExams {
    namespace Parameters {
      export type CurrentRole = "NEWBIE" | "TUTOR" | "HRBP" | "ADMIN";
      export type Keyword = string;
      export type OwnerId = number;
      export type Skip = number;
      export type Tag = string;
      export type Take = number;
      export type Wildcard = "BEGIN" | "END" | "BOTH" | "NONE";
    }
    export interface QueryParameters {
      skip?: Parameters.Skip;
      take: Parameters.Take;
      currentRole?: Parameters.CurrentRole;
      ownerId?: Parameters.OwnerId;
      keyword?: Parameters.Keyword;
      wildcard?: Parameters.Wildcard;
      tag?: Parameters.Tag;
    }
    namespace Responses {
      export type $200 = Components.Schemas.GetExamsResponseDto;
    }
  }
  namespace ExamControllerParseExamCsvFile {
    export type RequestBody = Components.Schemas.ParseExamCsvFileRequestDto;
    namespace Responses {
      export type $201 = Components.Schemas.ParseExamCsvFileResponseDto;
    }
  }
  namespace ExamControllerUpdateExam {
    namespace Parameters {
      export type Id = number;
    }
    export interface PathParameters {
      id: Parameters.Id;
    }
    export type RequestBody = Components.Schemas.UpdateExamRequestDto;
    namespace Responses {
      export type $201 = Components.Schemas.UpdateExamResponseDto;
    }
  }
  namespace FileControllerDoneFileUpload {
    export type RequestBody = Components.Schemas.DoneFileUploadRequestDto;
    namespace Responses {
      export type $201 = Components.Schemas.DoneFileUploadResponseDto;
    }
  }
  namespace FileControllerSignFileUpload {
    export type RequestBody = Components.Schemas.SignFileUploadRequestDto;
    namespace Responses {
      export type $201 = Components.Schemas.SignFileUploadResponseDto;
    }
  }
  namespace NewbieCommentControllerDeleteNewbieComment {
    namespace Parameters {
      export type CommentId = number;
      export type Id = number;
    }
    export interface PathParameters {
      id: Parameters.Id;
      commentId: Parameters.CommentId;
    }
    namespace Responses {
      export type $200 = Components.Schemas.DeleteNewbieCommentResponseDto;
    }
  }
  namespace NewbieCommentControllerGetNewbieComment {
    namespace Parameters {
      export type Id = number;
      export type Type = "NewbieToTutor" | "TutorToNewbie" | "TutorRecord";
    }
    export interface PathParameters {
      id: Parameters.Id;
    }
    export interface QueryParameters {
      type: Parameters.Type;
    }
    namespace Responses {
      export type $200 = Components.Schemas.GetNewbieCommentResponseDto;
    }
  }
  namespace NewbieCommentControllerUpdateNewbieComment {
    namespace Parameters {
      export type Id = number;
    }
    export interface PathParameters {
      id: Parameters.Id;
    }
    export type RequestBody = Components.Schemas.NewbieCommentRequestDto;
    namespace Responses {
      export type $201 = Components.Schemas.UpdateNewbieCommentResponseDto;
    }
  }
  namespace NewbieControllerAssignNewbieTutor {
    namespace Parameters {
      export type Id = number;
    }
    export interface PathParameters {
      id: Parameters.Id;
    }
    export type RequestBody = Components.Schemas.AssignNewbieTutorRequestDto;
    namespace Responses {
      export type $201 = Components.Schemas.AssignNewbieTutorResponseDto;
    }
  }
  namespace NewbieControllerGetNewbieDataShow {
    namespace Parameters {
      export type EndTime = string;
      export type StartTime = string;
    }
    export interface QueryParameters {
      startTime?: Parameters.StartTime;
      endTime?: Parameters.EndTime;
    }
    namespace Responses {
      export type $200 = Components.Schemas.GetNewbieDataShowResponseDto;
    }
  }
  namespace NewbieControllerGetNewbieProfile {
    namespace Parameters {
      export type Id = number;
    }
    export interface PathParameters {
      id: Parameters.Id;
    }
    namespace Responses {
      export type $200 = Components.Schemas.GetNewbieProfileResponseDto;
    }
  }
  namespace NewbieControllerGetNewbieTemplate {
    namespace Parameters {
      export type Id = number;
    }
    export interface PathParameters {
      id: Parameters.Id;
    }
    namespace Responses {
      export type $200 = Components.Schemas.GetNewbieTemplateResponseDto;
    }
  }
  namespace NewbieControllerGetNewbies {
    namespace Parameters {
      export type CityId = number;
      export type CurrentRole = "NEWBIE" | "TUTOR" | "HRBP" | "ADMIN";
      export type DivisionId = number;
      export type GetComments = boolean;
      export type Keyword = string;
      export type PendingFirst = boolean;
      export type Skip = number;
      export type Status = "graduated" | "training" | "preparing" | "pending";
      export type Take = number;
      export type TutorId = number;
      export type Wildcard = "BEGIN" | "END" | "BOTH" | "NONE";
    }
    export interface QueryParameters {
      skip?: Parameters.Skip;
      take: Parameters.Take;
      currentRole?: Parameters.CurrentRole;
      cityId?: Parameters.CityId;
      divisionId?: Parameters.DivisionId;
      keyword?: Parameters.Keyword;
      wildcard?: Parameters.Wildcard;
      status?: Parameters.Status;
      tutorId?: Parameters.TutorId;
      pendingFirst?: Parameters.PendingFirst;
      getComments?: Parameters.GetComments;
    }
    namespace Responses {
      export type $200 = Components.Schemas.GetNewbiesResponseDto;
    }
  }
  namespace NewbieControllerUpdateNewbieTemplate {
    namespace Parameters {
      export type Id = number;
    }
    export interface PathParameters {
      id: Parameters.Id;
    }
    export type RequestBody = Components.Schemas.UpdateNewbieTemplateRequestDto;
    namespace Responses {
      export type $201 = Components.Schemas.UpdateNewbieTemplateResponseDto;
    }
  }
  namespace NewbieTrainingControllerGetNewbieCourse {
    namespace Parameters {
      export type CourseId = number;
      export type Id = number;
    }
    export interface PathParameters {
      id: Parameters.Id;
      courseId: Parameters.CourseId;
    }
    namespace Responses {
      export type $200 = Components.Schemas.TraineeGetCourseResponseDto;
    }
  }
  namespace NewbieTrainingControllerGetNewbieExam {
    namespace Parameters {
      export type ExamId = number;
      export type Id = number;
    }
    export interface PathParameters {
      id: Parameters.Id;
      examId: Parameters.ExamId;
    }
    namespace Responses {
      export type $200 = Components.Schemas.TraineeGetExamResponseDto;
    }
  }
  namespace NewbieTrainingControllerGetNewbieTask {
    namespace Parameters {
      export type Id = number;
      export type TaskId = number;
    }
    export interface PathParameters {
      id: Parameters.Id;
      taskId: Parameters.TaskId;
    }
    namespace Responses {
      export type $200 = Components.Schemas.TraineeGetTaskResponseDto;
    }
  }
  namespace NewbieTrainingControllerSubmitNewbieCourseSection {
    namespace Parameters {
      export type CourseId = number;
      export type Id = number;
      export type SectionId = number;
    }
    export interface PathParameters {
      id: Parameters.Id;
      courseId: Parameters.CourseId;
      sectionId: Parameters.SectionId;
    }
    namespace Responses {
      export type $201 = Components.Schemas.TraineeSubmitCourseSectionResponseDto;
    }
  }
  namespace NewbieTrainingControllerSubmitNewbieExam {
    namespace Parameters {
      export type ExamId = number;
      export type Id = number;
    }
    export interface PathParameters {
      id: Parameters.Id;
      examId: Parameters.ExamId;
    }
    export type RequestBody = Components.Schemas.TraineeSubmitExamRequestDto;
    namespace Responses {
      export type $201 = Components.Schemas.TraineeSubmitExamResponseDto;
    }
  }
  namespace NewbieTrainingControllerSubmitNewbieTask {
    namespace Parameters {
      export type Id = number;
      export type TaskId = number;
    }
    export interface PathParameters {
      id: Parameters.Id;
      taskId: Parameters.TaskId;
    }
    namespace Responses {
      export type $201 = Components.Schemas.TraineeSubmitTaskResponseDto;
    }
  }
  namespace PermissionControllerGetPermission {
    namespace Parameters {
      export type Id = number;
      export type Role = "HRBP" | "ADMIN";
    }
    export interface PathParameters {
      id: Parameters.Id;
      role: Parameters.Role;
    }
    namespace Responses {
      export type $200 = Components.Schemas.GetPermissionResponseDto;
    }
  }
  namespace PermissionControllerSetPermission {
    namespace Parameters {
      export type Id = number;
      export type Role = "HRBP" | "ADMIN";
    }
    export interface PathParameters {
      id: Parameters.Id;
      role: Parameters.Role;
    }
    export type RequestBody = Components.Schemas.SetPermissionRequestDto;
    namespace Responses {
      export type $201 = Components.Schemas.SetPermissionResponseDto;
    }
  }
  namespace TagControllerCreateCity {
    export type RequestBody = Components.Schemas.CreateCityRequestDto;
    namespace Responses {
      export type $201 = Components.Schemas.CreateCityResponseDto;
    }
  }
  namespace TagControllerCreateDivision {
    export type RequestBody = Components.Schemas.CreateDivisionRequestDto;
    namespace Responses {
      export type $201 = Components.Schemas.CreateDivisionResponseDto;
    }
  }
  namespace TagControllerDeleteCity {
    namespace Parameters {
      export type Id = number;
    }
    export interface PathParameters {
      id: Parameters.Id;
    }
    namespace Responses {
      export type $200 = Components.Schemas.DeleteCityResponseDto;
    }
  }
  namespace TagControllerDeleteDivision {
    namespace Parameters {
      export type Id = number;
    }
    export interface PathParameters {
      id: Parameters.Id;
    }
    namespace Responses {
      export type $200 = Components.Schemas.DeleteDivisionResponseDto;
    }
  }
  namespace TagControllerGetCities {
    namespace Responses {
      export type $200 = Components.Schemas.GetCitiesResponseDto;
    }
  }
  namespace TagControllerGetCity {
    namespace Parameters {
      export type Id = number;
    }
    export interface PathParameters {
      id: Parameters.Id;
    }
    namespace Responses {
      export type $200 = Components.Schemas.GetCityResponseDto;
    }
  }
  namespace TagControllerGetDivision {
    namespace Parameters {
      export type Id = number;
    }
    export interface PathParameters {
      id: Parameters.Id;
    }
    namespace Responses {
      export type $200 = Components.Schemas.GetDivisionResponseDto;
    }
  }
  namespace TagControllerGetDivisions {
    namespace Responses {
      export type $200 = Components.Schemas.GetDivisionsResponseDto;
    }
  }
  namespace TagControllerUpdateCity {
    namespace Parameters {
      export type Id = number;
    }
    export interface PathParameters {
      id: Parameters.Id;
    }
    export type RequestBody = Components.Schemas.UpdateCityRequestDto;
    namespace Responses {
      export type $201 = Components.Schemas.UpdateCityResponseDto;
    }
  }
  namespace TagControllerUpdateDivision {
    namespace Parameters {
      export type Id = number;
    }
    export interface PathParameters {
      id: Parameters.Id;
    }
    export type RequestBody = Components.Schemas.UpdateDivisionRequestDto;
    namespace Responses {
      export type $201 = Components.Schemas.UpdateDivisionResponseDto;
    }
  }
  namespace TaskControllerCreateTask {
    export type RequestBody = Components.Schemas.CreateTaskRequestDto;
    namespace Responses {
      export type $201 = Components.Schemas.CreateTaskResponseDto;
    }
  }
  namespace TaskControllerDeleteTask {
    namespace Parameters {
      export type Id = number;
    }
    export interface PathParameters {
      id: Parameters.Id;
    }
    namespace Responses {
      export type $200 = Components.Schemas.DeleteTaskResponseDto;
    }
  }
  namespace TaskControllerGetTask {
    namespace Parameters {
      export type Id = number;
    }
    export interface PathParameters {
      id: Parameters.Id;
    }
    namespace Responses {
      export type $200 = Components.Schemas.GetTaskResponseDto;
    }
  }
  namespace TaskControllerGetTasks {
    namespace Parameters {
      export type CurrentRole = "NEWBIE" | "TUTOR" | "HRBP" | "ADMIN";
      export type Keyword = string;
      export type OwnerId = number;
      export type Skip = number;
      export type Tag = string;
      export type Take = number;
      export type Wildcard = "BEGIN" | "END" | "BOTH" | "NONE";
    }
    export interface QueryParameters {
      skip?: Parameters.Skip;
      take: Parameters.Take;
      currentRole?: Parameters.CurrentRole;
      ownerId?: Parameters.OwnerId;
      keyword?: Parameters.Keyword;
      wildcard?: Parameters.Wildcard;
      tag?: Parameters.Tag;
    }
    namespace Responses {
      export type $200 = Components.Schemas.GetTasksResponseDto;
    }
  }
  namespace TaskControllerUpdateTask {
    namespace Parameters {
      export type Id = number;
    }
    export interface PathParameters {
      id: Parameters.Id;
    }
    export type RequestBody = Components.Schemas.UpdateTaskRequestDto;
    namespace Responses {
      export type $201 = Components.Schemas.UpdateTaskResponseDto;
    }
  }
  namespace TemplateControllerGetTemplate {
    namespace Parameters {
      export type Id = number;
      export type Type = "newbie" | "tutor";
    }
    export interface PathParameters {
      type: Parameters.Type;
      id: Parameters.Id;
    }
    namespace Responses {
      export type $200 = Components.Schemas.GetTemplateResponseDto;
    }
  }
  namespace TemplateControllerGetTemplates {
    namespace Parameters {
      export type CurrentRole = "NEWBIE" | "TUTOR" | "HRBP" | "ADMIN";
      export type Skip = number;
      export type Take = number;
      export type Type = "newbie" | "tutor";
    }
    export interface PathParameters {
      type: Parameters.Type;
    }
    export interface QueryParameters {
      skip?: Parameters.Skip;
      take: Parameters.Take;
      currentRole?: Parameters.CurrentRole;
    }
    namespace Responses {
      export type $200 = Components.Schemas.GetTemplatesResponseDto;
    }
  }
  namespace TemplateControllerUpdateTemplate {
    namespace Parameters {
      export type Id = number;
      export type Type = "newbie" | "tutor";
    }
    export interface PathParameters {
      type: Parameters.Type;
      id: Parameters.Id;
    }
    export type RequestBody = Components.Schemas.TemplateRequestDto;
    namespace Responses {
      export type $201 = Components.Schemas.UpdateTemplateResponseDto;
    }
  }
  namespace TutorControllerApproveTutor {
    namespace Parameters {
      export type Id = number;
    }
    export interface PathParameters {
      id: Parameters.Id;
    }
    export type RequestBody = Components.Schemas.ApproveTutorRequestDto;
    namespace Responses {
      export type $201 = Components.Schemas.ApproveTutorResponseDto;
    }
  }
  namespace TutorControllerGetAwardsOfTutor {
    namespace Parameters {
      export type Id = number;
    }
    export interface PathParameters {
      id: Parameters.Id;
    }
    namespace Responses {
      export type $200 = Components.Schemas.GetAwardResponseDto;
    }
  }
  namespace TutorControllerGetTutorDataShow {
    namespace Parameters {
      export type EndTime = string;
      export type StartTime = string;
    }
    export interface QueryParameters {
      startTime?: Parameters.StartTime;
      endTime?: Parameters.EndTime;
    }
    namespace Responses {
      export type $200 = Components.Schemas.GetTutorDataShowResponseDto;
    }
  }
  namespace TutorControllerGetTutorProfile {
    namespace Parameters {
      export type Id = number;
    }
    export interface PathParameters {
      id: Parameters.Id;
    }
    namespace Responses {
      export type $200 = Components.Schemas.GetTutorProfileResponseDto;
    }
  }
  namespace TutorControllerGetTutors {
    namespace Parameters {
      export type CityId = number;
      export type CurrentRole = "NEWBIE" | "TUTOR" | "HRBP" | "ADMIN";
      export type DivisionId = number;
      export type Keyword = string;
      export type PendingFirst = boolean;
      export type Skip = number;
      export type Status = "graduated" | "training" | "approved" | "rejected" | "pending";
      export type Take = number;
      export type Wildcard = "BEGIN" | "END" | "BOTH" | "NONE";
    }
    export interface QueryParameters {
      skip?: Parameters.Skip;
      take: Parameters.Take;
      currentRole?: Parameters.CurrentRole;
      cityId?: Parameters.CityId;
      divisionId?: Parameters.DivisionId;
      keyword?: Parameters.Keyword;
      wildcard?: Parameters.Wildcard;
      status?: Parameters.Status;
      pendingFirst?: Parameters.PendingFirst;
    }
    namespace Responses {
      export type $200 = Components.Schemas.GetTutorsResponseDto;
    }
  }
  namespace TutorControllerGiveAwardToTutor {
    namespace Parameters {
      export type Id = number;
    }
    export interface PathParameters {
      id: Parameters.Id;
    }
    export type RequestBody = Components.Schemas.GiveAwardRequestDto;
    namespace Responses {
      export type $201 = Components.Schemas.GiveAwardResponseDto;
    }
  }
  namespace TutorControllerNominateTutor {
    namespace Parameters {
      export type Id = number;
    }
    export interface PathParameters {
      id: Parameters.Id;
    }
    namespace Responses {
      export type $201 = Components.Schemas.NominateTutorResponseDto;
    }
  }
  namespace TutorTrainingControllerGetTutorCourse {
    namespace Parameters {
      export type CourseId = number;
      export type Id = number;
    }
    export interface PathParameters {
      id: Parameters.Id;
      courseId: Parameters.CourseId;
    }
    namespace Responses {
      export type $200 = Components.Schemas.TraineeGetCourseResponseDto;
    }
  }
  namespace TutorTrainingControllerGetTutorExam {
    namespace Parameters {
      export type ExamId = number;
      export type Id = number;
    }
    export interface PathParameters {
      id: Parameters.Id;
      examId: Parameters.ExamId;
    }
    namespace Responses {
      export type $200 = Components.Schemas.TraineeGetExamResponseDto;
    }
  }
  namespace TutorTrainingControllerGetTutorTask {
    namespace Parameters {
      export type Id = number;
      export type TaskId = number;
    }
    export interface PathParameters {
      id: Parameters.Id;
      taskId: Parameters.TaskId;
    }
    namespace Responses {
      export type $200 = Components.Schemas.TraineeGetTaskResponseDto;
    }
  }
  namespace TutorTrainingControllerSubmitTutorCourseSection {
    namespace Parameters {
      export type CourseId = number;
      export type Id = number;
      export type SectionId = number;
    }
    export interface PathParameters {
      id: Parameters.Id;
      courseId: Parameters.CourseId;
      sectionId: Parameters.SectionId;
    }
    namespace Responses {
      export type $201 = Components.Schemas.TraineeSubmitCourseSectionResponseDto;
    }
  }
  namespace TutorTrainingControllerSubmitTutorExam {
    namespace Parameters {
      export type ExamId = number;
      export type Id = number;
    }
    export interface PathParameters {
      id: Parameters.Id;
      examId: Parameters.ExamId;
    }
    export type RequestBody = Components.Schemas.TraineeSubmitExamRequestDto;
    namespace Responses {
      export type $201 = Components.Schemas.TraineeSubmitExamResponseDto;
    }
  }
  namespace TutorTrainingControllerSubmitTutorTask {
    namespace Parameters {
      export type Id = number;
      export type TaskId = number;
    }
    export interface PathParameters {
      id: Parameters.Id;
      taskId: Parameters.TaskId;
    }
    namespace Responses {
      export type $201 = Components.Schemas.TraineeSubmitTaskResponseDto;
    }
  }
  namespace UserControllerCreateUser {
    export type RequestBody = Components.Schemas.CreateUserRequestDto;
    namespace Responses {
      export type $201 = Components.Schemas.CreateUserResponseDto;
    }
  }
  namespace UserControllerGetUserProfile {
    namespace Parameters {
      export type Id = number;
    }
    export interface PathParameters {
      id: Parameters.Id;
    }
    namespace Responses {
      export type $200 = Components.Schemas.GetUserProfileResponseDto;
    }
  }
  namespace UserControllerGetUsers {
    namespace Parameters {
      export type CityId = number;
      export type CurrentRole = "NEWBIE" | "TUTOR" | "HRBP" | "ADMIN";
      export type DivisionId = number;
      export type Keyword = string;
      export type Role = "NEWBIE" | "TUTOR" | "HRBP" | "ADMIN";
      export type Skip = number;
      export type Take = number;
      export type Wildcard = "BEGIN" | "END" | "BOTH" | "NONE";
      export type WithoutRole = boolean;
    }
    export interface QueryParameters {
      skip?: Parameters.Skip;
      take: Parameters.Take;
      currentRole?: Parameters.CurrentRole;
      cityId?: Parameters.CityId;
      divisionId?: Parameters.DivisionId;
      keyword?: Parameters.Keyword;
      wildcard?: Parameters.Wildcard;
      role?: Parameters.Role;
      withoutRole?: Parameters.WithoutRole;
    }
    namespace Responses {
      export type $200 = Components.Schemas.GetUsersResponseDto;
    }
  }
  namespace UserControllerUpdateUserPassword {
    namespace Parameters {
      export type Id = number;
    }
    export interface PathParameters {
      id: Parameters.Id;
    }
    export type RequestBody = Components.Schemas.UpdatePasswordRequestDto;
    namespace Responses {
      export type $201 = Components.Schemas.UpdatePasswordResponseDto;
    }
  }
  namespace UserControllerUpdateUserProfile {
    namespace Parameters {
      export type Id = number;
    }
    export interface PathParameters {
      id: Parameters.Id;
    }
    export type RequestBody = Components.Schemas.UpdateUserProfileRequestDto;
    namespace Responses {
      export type $201 = Components.Schemas.UpdateUserProfileResponseDto;
    }
  }
  namespace UserControllerUpdateUserRoles {
    namespace Parameters {
      export type Id = number;
    }
    export interface PathParameters {
      id: Parameters.Id;
    }
    export type RequestBody = Components.Schemas.UpdateUserRolesRequestDto;
    namespace Responses {
      export type $201 = Components.Schemas.UpdateUserRolesResponseDto;
    }
  }
}
