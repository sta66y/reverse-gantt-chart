// pages/Project/Project.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import GanttChart from "../../components/ui/GanttChart";
import TaskTree from "../../components/ui/TaskTree";
import TaskModal from "../../components/ui/TaskModal";
import CommentsModal from "../../components/ui/CommentsModal";
import styles from "./Project.module.css";
import { useNotification } from "../../contexts/NotificationContext";
import ReviewerStatusModal from "../../components/ui/ReviewerStatusModal";
import TaskStatusModal from "../../components/ui/TaskStatusModal";
import TaskAssignModal from "../../components/ui/TaskAssignModal/TaskAssignModal";

const Project = () => {
  const apiAddress = import.meta.env.VITE_API_ADDRESS;
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [projectDeadline, setProjectDeadline] = useState(null);
  const [projectCreatedDate, setProjectCreatedDate] = useState(null);
  const [projectUpdatedDate, setProjectUpdatedDate] = useState(null);
  const [projectOwnerEmail, setProjectOwnerEmail] = useState(null);
  const [projectUsers, setProjectUsers] = useState([]);

  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState("gantt"); // 'gantt', 'tree', 'users'

  const [isProjectInfoOpen, setIsProjectInfoOpen] = useState(false);
  const [isCommentsModalOpen, setIsCommentsModalOpen] = useState(false); // НОВОЕ состояние
  const [taskForComments, setTaskForComments] = useState(null); // Задача для комментариев

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editProjectData, setEditProjectData] = useState({
    projectName: "",
    projectDescription: "",
    deadline: "",
  });
  const [editErrors, setEditErrors] = useState({});
  const [isSubmittingEdit, setIsSubmittingEdit] = useState(false);

  const { showError, showSuccess } = useNotification();

  // Добавьте в состояние:
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [newUserData, setNewUserData] = useState({
    username: "",
    email: "",
    userRole: "ROLE_STUDENT",
  });
  const [addUserErrors, setAddUserErrors] = useState({});
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [userToEditRole, setUserToEditRole] = useState(null);
  const [selectedRole, setSelectedRole] = useState("");

  const [isTaskStatusModalOpen, setIsTaskStatusModalOpen] = useState(false);
  const [isReviewerStatusModalOpen, setIsReviewerStatusModalOpen] =
    useState(false);

  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);

  // В состоянии компонента Project добавьте:
  const [invites, setInvites] = useState([]);
  const [invitesView, setInvitesView] = useState("pending"); // 'pending', 'all'
  const [selectedInvite, setSelectedInvite] = useState(null);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  // Тестовые данные пользователей проекта
  // setProjectUsers([
  //   { email: 'project.manager@company.com', role: 'Менеджер' },
  //   { email: 'frontend.dev@company.com', role: 'Разработчик' },
  //   { email: 'backend.dev@company.com', role: 'Разработчик' },
  //   { email: 'designer.anna@company.com', role: 'Дизайнер' },
  //   { email: 'analyst.maria@company.com', role: 'Аналитик' },
  //   { email: 'qa.sergey@company.com', role: 'Тестировщик' },
  //   { email: 'stakeholder@company.com', role: 'Владелец' },
  //   { email: 'devops@company.com', role: 'Разработчик' },
  // ]);
  const handleTaskAssign = (task) => {
    setSelectedTask(task);
    setIsAssignModalOpen(true);
  };
  // Функция для обновления после назначения
  const handleAssignUpdate = (updatedTask) => {
    // Перезагружаем задачи проекта
    getProjectTasks();
  };

  const handleTaskStatusChange = (task) => {
    setSelectedTask(task);
    setIsTaskStatusModalOpen(true);
  };

  const handleReviewerStatusChange = (task) => {
    setSelectedTask(task);
    setIsReviewerStatusModalOpen(true);
  };

  const handleStatusUpdate = (updatedTask) => {
    // Обновляем задачу после изменения статуса
    getProjectTasks();
  };

  useEffect(() => {
    //const mockTasks = generateMockTasks();
    getProjectInfo();
    getProjectUsers();
    getProjectTasks();
    getProjectInvites();
    //setTasks(mockTasks);
  }, []);

  const getProjectInfo = async () => {
    const response = await fetch(
      apiAddress + "project/info" + "?projectId=" + projectId,
      {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      }
    );

    if (response.ok) {
      const data = await response.json();
      setProjectName(data.projectName);
      setProjectDescription(data.projectDescription);
      setProjectDeadline(data.deadline);
      setProjectCreatedDate(data.createdAt);
      setProjectUpdatedDate(data.updatedAt);
      setProjectOwnerEmail(data.projectOwnerEmail);
    } else {
      setProjectName("unknown");
      console.log("Не удалось получить название проекта");
    }
  };
  const deleteProject = async () => {
    const response = await fetch(
      apiAddress + "project/action/delete" + "?projectId=" + projectId,
      {
        method: "DELETE",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      }
    );

    if (response.ok) {
      console.log("Текущий проект успешно удален");
    } else {
      console.log("Не удалось удалить проект");
      showError({
        message: "Не удалось удалить проект",
        code: response.status,
      });
    }
  };

  // Добавьте эту функцию после других get функций
  const getProjectInvites = async () => {
    try {
      const response = await fetch(
        apiAddress + "invite/action/all?projectId=" + projectId,
        {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("Получены приглашения:", data);
        setInvites(data);
      } else {
        console.log("Не удалось получить приглашения");
      }
    } catch (err) {
      console.error("Ошибка загрузки приглашений:", err);
    }
  };
  // Функция для повторной отправки приглашения
  const handleResendInvite = async (email) => {
    try {
      const response = await fetch(
        apiAddress +
          "invite/action/resend?email=" +
          email +
          "&projectId=" +
          projectId,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.ok) {
        // Обновляем список приглашений
        await getProjectInvites();
        showSuccess("Приглашение было переотправлено!");
      } else {
        const errorData = await response.json();
        showError({
          message: errorData.message || "Ошибка повторной отправки",
          code: response.status,
        });
      }
    } catch (err) {
      showError({
        message: "Ошибка соединения",
        code: "NETWORK_ERROR",
      });
      console.error(err);
    }
  };

  // Функция для изменения роли приглашения
  const handleChangeInviteRole = async (email, newRole) => {
    try {
      const response = await fetch(apiAddress + "invite/action/changeRole?projectId=" + projectId, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email,
          role: newRole,
        }),
      });

      if (response.ok) {
        await getProjectInvites();
      } else {
        const errorData = await response.json();
        showError({
          message: errorData.message || "Ошибка изменения роли",
          code: response.status,
        });
      }
    } catch (err) {
      showError({
        message: "Ошибка соединения",
        code: "NETWORK_ERROR",
      });
      console.error(err);
    }
  };

  // Функция для удаления приглашения
  const handleDeleteInvite = async (email) => {
    try {
      const response = await fetch(
        apiAddress +
          "invite/action/delete?email=" +
          email +
          "&projectId=" +
          projectId,
        {
          method: "DELETE",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.ok) {
        await getProjectInvites();
      } else {
        const errorData = await response.json();
        showError({
          message: errorData.message || "Ошибка удаления приглашения",
          code: response.status,
        });
      }
    } catch (err) {
      showError({
        message: "Ошибка соединения",
        code: "NETWORK_ERROR",
      });
      console.error(err);
    }
  };

  // Функция для преобразования статуса приглашения
  const getInviteStatusString = (status) => {
    const statusMap = {
      SUBMITTED: "Отправлено",
      REJECTED: "Отклонено",
      EXPIRED: "Истекло",
    };
    return statusMap[status] || status;
  };

  // Функция для определения цвета статуса
  const getInviteStatusColor = (status) => {
    const colorMap = {
      SUBMITTED: "#28a745", // Зеленый
      REJECTED: "#dc3545", // Красный
      EXPIRED: "#6c757d", // Серый
    };
    return colorMap[status] || "#6c757d";
  };

  // Добавьте эту функцию после других функций get:
  const getProjectTasks = async () => {
    try {
      const response = await fetch(
        apiAddress + "projectComponent/all" + "?projectId=" + projectId,
        {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("Получены задачи:", data);

        // Преобразуем данные API в формат для UI
        const transformedTasks = transformApiTasksToUITasks(data);
        setTasks(transformedTasks);
      } else {
        const errorData = await response.json();
        showError({
          message: errorData.message || "Не удалось загрузить задачи",
          code: response.status,
        });
      }
    } catch (err) {
      showError({
        message: "Ошибка соединения при загрузке задач",
        code: "NETWORK_ERROR",
      });
      console.error(err);
    }
  };

  // Функция для преобразования API данных в формат UI
  const transformApiTasksToUITasks = (apiTasks) => {
    if (!apiTasks || !Array.isArray(apiTasks)) {
      return [];
    }

    return apiTasks.map((task) => ({
      id: task.id?.toString() || Date.now().toString(),
      title: task.title || "Без названия",
      description: task.description || "",
      // Сохраняем полные даты с временем для редактирования
      startDate: task.startDate || task.startData || "",
      endDate: task.deadline || "",
      // Добавляем отдельные поля времени
      startTime: extractTimeFromDate(task.startDate || task.startData),
      endTime: extractTimeFromDate(task.deadline),
      status: task.taskStatus?.status || "Planned",
      reviewerStatus: task.reviewerTaskStatus?.status || "None",
      children: task.children ? transformApiTasksToUITasks(task.children) : [],
      parentId: task.parentId?.toString() || null,
      creator: task.creator,
      comments: task.comments || [],
      taskMakers: task.taskMakers || [],
      taskStatus: task.taskStatus,
      reviewerTaskStatus: task.reviewerTaskStatus,
      projectId: task.projectId,
      createdDate: task.createdDate,
      pos: task.pos,
      globalTaskStatus: task.globalTaskStatus
    }));
  };

  // Функция для извлечения времени из полной даты
  const extractTimeFromDate = (dateString) => {
    if (!dateString || typeof dateString !== "string") return "";

    // Проверяем разные форматы
    if (dateString.includes("T")) {
      // Формат: "2024-12-18T14:30:00"
      const timePart = dateString.split("T")[1];
      return timePart.substring(0, 5); // HH:mm
    } else if (dateString.includes(" ")) {
      // Формат: "2024-12-18 14:30:00"
      const timePart = dateString.split(" ")[1];
      return timePart.substring(0, 5); // HH:mm
    }

    return "";
  };

  // Функция для форматирования дат
  const formatDateForUI = (date) => {
    if (!date) return "";

    // Если это строка даты
    if (typeof date === "string") {
      return date.split("T")[0]; // Берем только дату без времени
    }

    // Если это объект Date или timestamp
    try {
      const d = new Date(date);
      return d.toISOString().split("T")[0];
    } catch (err) {
      return "";
    }
  };

  const getProjectUsers = async () => {
    const response = await fetch(
      apiAddress + "membership/getAll" + "?projectId=" + projectId,
      {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      }
    );
    if (response.ok) {
      console.log("Пользователи проекта получены");
      const data = await response.json();
      const result = data.map((item) => {
        return {
          username: item.username,
          email: item.email,
          role: item.userRole,
        };
      });
      setProjectUsers(result);
    } else {
      console.log("Не удалось получить пользователей проекта");
    }
  };

  const handleDeleteProject = async () => {
    console.log("Удаление проекта:", projectId);
    if (window.confirm(`Удалить проект "${projectName}"?`)) {
      await deleteProject();
      handleBackToProjects();
    }
  };

  const handleAddUserClick = () => {
    setNewUserData({
      username: "",
      email: "",
      userRole: "ROLE_STUDENT",
    });
    setAddUserErrors({});
    setIsAddUserModalOpen(true);
  };

  // Валидация формы добавления пользователя
  const validateAddUserForm = () => {
    const errors = {};

    if (!newUserData.email.trim()) {
      errors.email = "Email обязателен";
    } else if (!/\S+@\S+\.\S+/.test(newUserData.email)) {
      errors.email = "Введите корректный email";
    }

    if (!newUserData.userRole) {
      errors.userRole = "Роль обязательна";
    }

    setAddUserErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Функция добавления пользователя в проект
  const handleAddUser = async () => {
    if (!validateAddUserForm()) return;

    setIsAddingUser(true);

    try {
      const response = await fetch(
        apiAddress + "invite/action/send" + "?projectId=" + projectId,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: newUserData.email,
            projectId: projectId,
            role: newUserData.userRole,
          }),
        }
      );

      if (response.ok) {
        await getProjectInvites();
        // Обновляем список пользователей
        await getProjectUsers();

        // Закрываем модальное окно
        setIsAddUserModalOpen(false);
        setAddUserErrors({});

        // Очищаем форму
        setNewUserData({
          username: "",
          email: "",
          userRole: "ROLE_STUDENT",
        });
      } else {
        const errorData = await response.json();
        setAddUserErrors({
          api: errorData.message || "Ошибка добавления пользователя",
        });
        showError?.({
          message: errorData.message || "Ошибка добавления пользователя",
          code: response.status,
        });
      }
    } catch (err) {
      setAddUserErrors({ api: "Ошибка соединения" });
      showError?.({
        message: "Ошибка соединения при добавлении пользователя",
        code: "NETWORK_ERROR",
      });
      console.error(err);
    } finally {
      setIsAddingUser(false);
    }
  };

  // Функция для удаления пользователя из проекта
  const handleDeleteUserClick = (user) => {
    setUserToDelete(user);
  };

  const handleConfirmDeleteUser = async () => {
    if (!userToDelete) return;

    try {
      const response = await fetch(
        apiAddress +
          "membership/action/remove" +
          "?projectId=" +
          projectId +
          "&projectUsername=" +
          userToDelete.username,
        {
          method: "DELETE",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.ok) {
        // Обновляем список пользователей
        await getProjectUsers();
      } else {
        const errorData = await response.json();
        showError?.({
          message: errorData.message || "Ошибка удаления пользователя",
          code: response.status,
        });
      }
    } catch (err) {
      showError?.({
        message: "Ошибка соединения при удалении пользователя",
        code: "NETWORK_ERROR",
      });
      console.error(err);
    } finally {
      setUserToDelete(null);
    }
  };

  // Функция для изменения роли пользователя
  const handleEditRoleClick = (user) => {
    setUserToEditRole(user);
    setSelectedRole(user.role);
  };

  const handleConfirmEditRole = async () => {
    if (!userToEditRole || !selectedRole) return;

    const getRequestRoleName = (role) => {
      const roleRequestNames = {
        ROLE_PLANNER: "PLANNER",
        ROLE_REVIEWER: "REVIEWER",
        ROLE_STUDENT: "STUDENT",
        ROLE_VIEWER: "VIEWER",
      };
      return roleRequestNames[role] || "unknown";
    };

    try {
      const response = await fetch(
        apiAddress +
          "membership/action/updateAuthority" +
          "?projectId=" +
          projectId +
          "&projectUsername=" +
          userToEditRole.username +
          "&role=" +
          getRequestRoleName(selectedRole),
        {
          method: "PATCH",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.ok) {
        // Обновляем список пользователей
        await getProjectUsers();
      } else {
        const errorData = await response.json();
        showError?.({
          message: errorData.message || "Ошибка изменения роли",
          code: response.status,
        });
      }
    } catch (err) {
      showError?.({
        message: "Ошибка соединения при изменении роли",
        code: "NETWORK_ERROR",
      });
      console.error(err);
    } finally {
      setUserToEditRole(null);
      setSelectedRole("");
    }
  };

  // Обработчик изменения полей формы добавления пользователя
  const handleNewUserInputChange = (e) => {
    const { name, value } = e.target;
    setNewUserData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Очищаем ошибку при вводе
    if (addUserErrors[name]) {
      setAddUserErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Добавьте функцию для открытия модального окна редактирования:
  const handleEditProject = () => {
    // Заполняем форму текущими данными проекта
    setEditProjectData({
      projectName: projectName,
      projectDescription: projectDescription || "",
      deadline: projectDeadline
        ? new Date(projectDeadline).toISOString().split("T")[0]
        : "",
    });
    setEditErrors({});
    setIsEditModalOpen(true);
  };

  // Функция валидации формы редактирования:
  const validateEditForm = () => {
    const errors = {};

    if (!editProjectData.projectName.trim()) {
      errors.projectName = "Название обязательно";
    }

    if (editProjectData.projectName.trim().length < 3) {
      errors.projectName = "Название должно быть не менее 3 символов";
    }

    if (!editProjectData.projectDescription.trim()) {
      errors.projectDescription = "Описание обязательно";
    }

    if (editProjectData.deadline) {
      const deadlineDate = new Date(editProjectData.deadline);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (deadlineDate < today) {
        errors.deadline = "Дедлайн не может быть в прошлом";
      }
    }

    setEditErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Функция для сохранения изменений:
  const handleSaveProject = async () => {
    if (!validateEditForm()) return;

    setIsSubmittingEdit(true);

    try {
      const response = await fetch(
        apiAddress + "project/action/update" + "?projectId=" + projectId,
        {
          method: "PATCH",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            projectName: editProjectData.projectName,
            projectDescription: editProjectData.projectDescription,
            deadline: editProjectData.deadline || null,
          }),
        }
      );

      if (response.ok) {
        // Обновляем данные проекта
        await getProjectInfo();

        // Закрываем модальное окно
        setIsEditModalOpen(false);
        setEditErrors({});
      } else {
        const errorData = await response.json();
        setEditErrors({
          api: errorData.message || "Ошибка обновления проекта",
        });
        showError?.({
          message: errorData.message || "Ошибка обновления проекта",
          code: response.status,
        });
      }
    } catch (err) {
      setEditErrors({ api: "Ошибка соединения" });
      showError?.({
        message: "Ошибка соединения при обновлении проекта",
        code: "NETWORK_ERROR",
      });
      console.error(err);
    } finally {
      setIsSubmittingEdit(false);
    }
  };

  // Обработчик изменения полей формы:
  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditProjectData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Очищаем ошибку при вводе
    if (editErrors[name]) {
      setEditErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleBackToProjects = () => {
    navigate("/projects");
  };

  const handleShowProjectInfo = () => {
    setIsProjectInfoOpen(true);
  };

  const handleCloseProjectInfo = () => {
    setIsProjectInfoOpen(false);
  };

  const handleShowComments = (task) => {
    setTaskForComments(task);
    setIsCommentsModalOpen(true);
  };

  // Функция для добавления комментария
  // В Project.jsx убедитесь что функция handleAddComment выглядит так:
  const handleAddComment = async (taskId, commentText) => {
    if (!commentText.trim()) return;

    try {
      const response = await fetch(
        apiAddress + "comment/create?projectId=" + projectId,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            projectComponentId: parseInt(taskId),
            comment: commentText,
          }),
        }
      );

      if (response.ok) {
        const newComment = await response.json();
        console.log("Комментарий создан:", newComment);

        // Обновляем задачи с новым комментарием
        await getProjectTasks();

        // Обновляем также taskForComments если он открыт
        if (taskForComments && taskForComments.id === taskId) {
          // Обновляем локально для мгновенного отображения
          setTaskForComments((prev) => ({
            ...prev,
            comments: [
              ...(prev.comments || []),
              {
                id: newComment.id?.toString(),
                comment: newComment.comment,
                commenter: newComment.commenter,
                createdAt: newComment.createdAt,
              },
            ],
          }));
        }
      } else {
        const errorData = await response.json();
        showError?.({
          message: errorData.message || "Ошибка добавления комментария",
          code: response.status,
        });
      }
    } catch (err) {
      showError?.({
        message: "Ошибка соединения при добавлении комментария",
        code: "NETWORK_ERROR",
      });
      console.error(err);
    }
  };
  const handleAddTask = (parentId = null) => {
    setSelectedTask({ parentId });
    setIsModalOpen(true);
  };

  const handleSaveTask = async (taskData) => {
    try {
      if (taskData.id) {
        // Обновление существующей задачи
        const response = await fetch(
          apiAddress + "projectComponent/action/update?projectId=" + projectId,
          {
            method: "PATCH",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              componentId: parseInt(taskData.id),
              title: taskData.title,
              description: taskData.description,
              startDate: taskData.startDate,
              deadlineDate: taskData.endDate,
              startTime: taskData.startTime,
              deadlineTime: taskData.endTime,
            }),
          }
        );

        if (response.ok) {
          // НЕ обновляем локально, а перезагружаем с сервера
          await getProjectTasks(); // Это ключевое!
        } else {
          const errorData = await response.json();
          showError({
            message: errorData.message || "Ошибка обновления задачи",
            code: response.status,
          });
        }
      } else {
        // Создание новой задачи
        const response = await fetch(
          apiAddress + "projectComponent/action/create?projectId=" + projectId,
          {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              title: taskData.title,
              description: taskData.description,
              startDate: taskData.startDate,
              deadlineDate: taskData.endDate,
              deadlineTime: taskData.endTime,
              startTime: taskData.startTime,
              parentId: taskData.parentId ? parseInt(taskData.parentId) : null,
            }),
          }
        );

        if (response.ok) {
          // Перезагружаем задачи с сервера
          await getProjectTasks(); // Это ключевое!
        } else {
          const errorData = await response.json();
          showError({
            message: errorData.message || "Ошибка создания задачи",
            code: response.status,
          });
        }
      }
    } catch (err) {
      showError({
        message: "Ошибка соединения",
        code: "NETWORK_ERROR",
      });
      console.error(err);
    } finally {
      setIsModalOpen(false);
      setSelectedTask(null);
    }
  };

  const handleDeleteTask = async (taskId) => {
    const response = await fetch(
      apiAddress +
        "projectComponent/action/delete?projectId=" +
        projectId +
        "&componentId=" +
        taskId,
      {
        method: "DELETE",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      }
    );
    if (response.ok) {
      setTasks((prev) => deleteTaskFromTree(prev, taskId));
    } else {
      showError({
        message: "Не удалось удалить таску",
        code: response.status,
      });
    }
  };

  const updateTaskInTree = (tasks, updatedTask) => {
    return tasks.map((task) => {
      if (task.id === updatedTask.id) {
        return { ...task, ...updatedTask };
      }
      if (task.children) {
        return {
          ...task,
          children: updateTaskInTree(task.children, updatedTask),
        };
      }
      return task;
    });
  };

  const addTaskToParent = (tasks, parentId, newTask) => {
    return tasks.map((task) => {
      if (task.id === parentId) {
        return { ...task, children: [...(task.children || []), newTask] };
      }
      if (task.children) {
        return {
          ...task,
          children: addTaskToParent(task.children, parentId, newTask),
        };
      }
      return task;
    });
  };

  const deleteTaskFromTree = (tasks, taskId) => {
    return tasks.filter((task) => {
      if (task.id === taskId) {
        if (task.children && task.children.length > 0) {
          alert("Нельзя удалить задачу с подзадачами!");
          return true;
        }
        return false;
      }
      if (task.children) {
        task.children = deleteTaskFromTree(task.children, taskId);
      }
      return true;
    });
  };

  const getRoleColor = (role) => {
    const roleColors = {
      ROLE_ADMIN: "#ff6b6b",
      ROLE_PLANNER: "#4ecdc4",
      ROLE_REVIEWER: "#45b7d1",
      ROLE_STUDENT: "#96ceb4",
      ROLE_VIEWER: "#feca57",
    };
    return roleColors[role] || "#667eea";
  };
  const getRoleString = (role) => {
    const roleStrings = {
      ROLE_ADMIN: "Админ",
      ROLE_PLANNER: "Планнер",
      ROLE_REVIEWER: "Ревьюер",
      ROLE_STUDENT: "Студент",
      ROLE_VIEWER: "Гость",
    };
    return roleStrings[role] || "Неизвестный";
  };

  const getRoleStats = () => {
    const stats = {};
    projectUsers.forEach((user) => {
      stats[user.role] = (stats[user.role] || 0) + 1;
    });
    return stats;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Не указана";
    return new Date(dateString).toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const roleStats = getRoleStats();

  return (
    <div className={styles.project}>
      <header className={styles.header}>
        <div className={styles.headerTop}>
          <h1>{projectName || "Загрузка..."}</h1>
          <div className={styles.headerTopRightSection}>
            <button
              className={styles.backButton}
              onClick={handleBackToProjects}
              title="Вернуться к проектам"
            >
              ← Назад к проектам
            </button>
            <button
              className={styles.infoButton}
              onClick={handleShowProjectInfo}
              title="Информация о проекте"
            >
              ℹ️ О проекте
            </button>
          </div>
        </div>
        <div className={styles.headerMiddle}>
          <button
            className={styles.exitButton}
            onClick={handleDeleteProject}
            title="Удалить проект"
          >
            Удалить проект
          </button>
          <button
            className={styles.editButton}
            onClick={handleEditProject}
            title="Редактировать проект"
          >
            Редактировать проект
          </button>
        </div>
        <div className={styles.headerBottom}>
          <div className={styles.controls}>
            <button
              className={styles.addButton}
              onClick={() => handleAddTask()}
            >
              + Добавить задачу
            </button>
            <div className={styles.viewToggle}>
              <button
                className={viewMode === "gantt" ? styles.active : ""}
                onClick={() => setViewMode("gantt")}
              >
                Диаграмма Ганта
              </button>
              <button
                className={viewMode === "tree" ? styles.active : ""}
                onClick={() => setViewMode("tree")}
              >
                Дерево задач
              </button>
              <button
                className={viewMode === "users" ? styles.active : ""}
                onClick={() => setViewMode("users")}
              >
                Участники
              </button>
              <button
                className={viewMode === "invites" ? styles.active : ""}
                onClick={() => setViewMode("invites")}
              >
                Приглашения
              </button>
            </div>
          </div>
        </div>
      </header>
      <main className={styles.main}>
        {viewMode === "gantt" ? (
          <GanttChart
            tasks={tasks}
            onTaskSelect={setSelectedTask}
            onTaskEdit={(task) => {
              setSelectedTask(task);
              setIsModalOpen(true);
            }}
            onAddSubtask={handleAddTask}
            onDeleteTask={handleDeleteTask}
            onShowComments={handleShowComments}
            onTaskStatusChange={handleTaskStatusChange}
            onReviewerStatusChange={handleReviewerStatusChange}
            onTaskAssign={handleTaskAssign}
          />
        ) : viewMode === "tree" ? (
          <TaskTree
            tasks={tasks}
            onTaskSelect={setSelectedTask}
            onTaskEdit={(task) => {
              setSelectedTask(task);
              setIsModalOpen(true);
            }}
            onAddSubtask={handleAddTask}
            onDeleteTask={handleDeleteTask}
            onShowComments={handleShowComments}
            onTaskStatusChange={handleTaskStatusChange}
            onReviewerStatusChange={handleReviewerStatusChange}
            onTaskAssign={handleTaskAssign}
          />
        ) : viewMode === "invites" ? (
          <div className={styles.invitesView}>
            <div className={styles.invitesHeader}>
              <div className={styles.invitesHeaderLeft}>
                <h3>Приглашения в проект</h3>
                <div className={styles.viewToggleInvites}>
                  <button
                    className={invitesView === "pending" ? styles.active : ""}
                    onClick={() => setInvitesView("pending")}
                  >
                    Активные
                  </button>
                  <button
                    className={invitesView === "all" ? styles.active : ""}
                    onClick={() => setInvitesView("all")}
                  >
                    Все
                  </button>
                </div>
              </div>
              <div className={styles.statsSummary}>
                <div className={styles.statItem}>
                  <span className={styles.statNumber}>
                    {
                      invites.filter((i) => i.inviteStatus === "SUBMITTED")
                        .length
                    }
                  </span>
                  <span className={styles.statLabel}>Активных</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statNumber}>
                    {invites.filter((i) => i.inviteStatus === "EXPIRED").length}
                  </span>
                  <span className={styles.statLabel}>Истекших</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statNumber}>{invites.length}</span>
                  <span className={styles.statLabel}>Всего</span>
                </div>
              </div>
            </div>

            {invites.length === 0 ? (
              <div className={styles.noInvites}>
                <p>Нет отправленных приглашений</p>
                <button
                  className={styles.addUserButton}
                  onClick={handleAddUserClick}
                >
                  + Пригласить участника
                </button>
              </div>
            ) : (
              <div className={styles.invitesTable}>
                <div className={styles.tableHeader}>
                  <div className={styles.tableCell}>Email</div>
                  <div className={styles.tableCell}>Роль</div>
                  <div className={styles.tableCell}>Статус</div>
                  <div className={styles.tableCell}>Отправитель</div>
                  <div className={styles.tableCell}>Дата отправки</div>
                  <div className={styles.tableCell}>Действия</div>
                </div>
                {invites
                  .filter(
                    (invite) =>
                      invitesView === "all" ||
                      invite.inviteStatus === "SUBMITTED"
                  )
                  .map((invite, index) => (
                    <div
                      key={`${invite.invitedPersonEmail}-${index}`}
                      className={styles.tableRow}
                    >
                      <div className={styles.tableCell}>
                        <span className={styles.inviteEmail}>
                          {invite.invitedPersonEmail}
                        </span>
                      </div>
                      <div className={styles.tableCell}>
                        <span
                          className={styles.inviteRole}
                          style={{
                            backgroundColor: getRoleColor(invite.userRole),
                          }}
                        >
                          {getRoleString(invite.userRole)}
                        </span>
                      </div>
                      <div className={styles.tableCell}>
                        <span
                          className={styles.inviteStatus}
                          style={{
                            backgroundColor: getInviteStatusColor(
                              invite.inviteStatus
                            ),
                          }}
                        >
                          {getInviteStatusString(invite.inviteStatus)}
                        </span>
                      </div>
                      <div className={styles.tableCell}>
                        <span className={styles.inviterEmail}>
                          {invite.inviter || "Система"}
                        </span>
                      </div>
                      <div className={styles.tableCell}>
                        <span className={styles.inviteDate}>
                          {formatDate(invite.inviteDate) || "Неизвестно"}
                        </span>
                      </div>
                      <div className={styles.tableCell}>
                        <div className={styles.inviteActions}>
                          {invite.inviteStatus === "SUBMITTED" && (
                            <>
                              <button
                                className={styles.resendButton}
                                onClick={() =>
                                  handleResendInvite(invite.invitedPersonEmail)
                                }
                                title="Отправить повторно"
                              >
                                Повторить
                              </button>
                              <button
                                className={styles.editRoleButton}
                                onClick={() => {
                                  setSelectedInvite(invite);
                                  setIsInviteModalOpen(true);
                                }}
                                title="Изменить роль"
                              >
                                Изменить роль
                              </button>
                            </>
                          )}
                          <button
                            className={styles.deleteButton}
                            onClick={() => {
                              if (
                                window.confirm(
                                  `Удалить приглашение для ${invite.invitedPersonEmail}?`
                                )
                              ) {
                                handleDeleteInvite(invite.invitedPersonEmail);
                              }
                            }}
                            title="Удалить приглашение"
                          >
                            Удалить
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        ) : (
          <div className={styles.usersView}>
            <div className={styles.statsSection}>
              <h3>Статистика по ролям</h3>
              <div className={styles.statsGrid}>
                {Object.entries(roleStats).map(([role, count]) => (
                  <div key={role} className={styles.statCard}>
                    <div
                      className={styles.statColor}
                      style={{ backgroundColor: getRoleColor(role) }}
                    />
                    <div className={styles.statInfo}>
                      <span className={styles.statRole}>
                        {getRoleString(role)}
                      </span>
                      <span className={styles.statCount}>{count} чел.</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.usersList}>
              <div className={styles.usersHeader}>
                <h3>Все участники проекта</h3>
                <button
                  className={styles.addUserButton}
                  onClick={handleAddUserClick}
                >
                  + Пригласить участника
                </button>
              </div>
              <div className={styles.usersTable}>
                <div className={styles.tableHeader}>
                  <div className={styles.tableCell}>Username</div>
                  <div className={styles.tableCell}>Email</div>
                  <div className={styles.tableCell}>Роль</div>
                  <div className={styles.tableCell}>Действия</div>
                </div>
                {projectUsers.map((user, index) => (
                  <div
                    key={`${user.email}-${index}`}
                    className={styles.tableRow}
                  >
                    <div className={styles.tableCell}>
                      <span className={styles.userEmail}>{user.username}</span>
                    </div>
                    <div className={styles.tableCell}>
                      <span className={styles.userEmail}>{user.email}</span>
                    </div>
                    <div className={styles.tableCell}>
                      <span
                        className={styles.userRole}
                        style={{ backgroundColor: getRoleColor(user.role) }}
                      >
                        {getRoleString(user.role)}
                      </span>
                    </div>
                    {user.email == projectOwnerEmail ? null : (
                      <div className={styles.tableCell}>
                        <div className={styles.userActions}>
                          <button
                            className={styles.editRoleButton}
                            onClick={() => handleEditRoleClick(user)}
                            title="Изменить роль"
                          >
                            Изменить роль
                          </button>
                          <button
                            className={styles.deleteButton}
                            onClick={() => handleDeleteUserClick(user)}
                            title="Удалить из проекта"
                          >
                            Удалить
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
      {isInviteModalOpen && selectedInvite && (
        <div
          className={styles.modalOverlay}
          onClick={() => setIsInviteModalOpen(false)}
        >
          <div
            className={styles.editRoleModal}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <h2>Изменение роли приглашения</h2>
              <button
                className={styles.closeButton}
                onClick={() => setIsInviteModalOpen(false)}
              >
                ✕
              </button>
            </div>

            <div className={styles.modalBody}>
              <p>
                Изменить роль для приглашения:{" "}
                <strong>{selectedInvite.invitedPersonEmail}</strong>
              </p>

              <div className={styles.formGroup}>
                <label htmlFor="newInviteRole">Новая роль</label>
                <select
                  id="newInviteRole"
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className={styles.roleSelect}
                >
                  <option value="ROLE_PLANNER">Планнер</option>
                  <option value="ROLE_REVIEWER">Ревьюер</option>
                  <option value="ROLE_STUDENT">Студент</option>
                  <option value="ROLE_VIEWER">Гость</option>
                </select>
              </div>

              <div className={styles.currentInfo}>
                <div className={styles.infoRow}>
                  <span>Текущая роль:</span>
                  <span
                    className={styles.currentRole}
                    style={{
                      backgroundColor: getRoleColor(selectedInvite.userRole),
                    }}
                  >
                    {getRoleString(selectedInvite.userRole)}
                  </span>
                </div>
                <div className={styles.infoRow}>
                  <span>Статус:</span>
                  <span
                    className={styles.currentStatus}
                    style={{
                      backgroundColor: getInviteStatusColor(
                        selectedInvite.inviteStatus
                      ),
                    }}
                  >
                    {getInviteStatusString(selectedInvite.inviteStatus)}
                  </span>
                </div>
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button
                className={styles.cancelButton}
                onClick={() => setIsInviteModalOpen(false)}
              >
                Отмена
              </button>
              <button
                className={styles.saveButton}
                onClick={() => {
                  if (selectedRole) {
                    handleChangeInviteRole(
                      selectedInvite.invitedPersonEmail,
                      selectedRole
                    );
                    setIsInviteModalOpen(false);
                    setSelectedInvite(null);
                    setSelectedRole("");
                  }
                }}
                disabled={
                  !selectedRole || selectedRole === selectedInvite.userRole
                }
              >
                Сохранить изменения
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Модальное окно комментариев */}
      {isCommentsModalOpen && taskForComments && (
        <CommentsModal
          task={taskForComments}
          onClose={() => {
            setIsCommentsModalOpen(false);
            setTaskForComments(null);
          }}
          onAddComment={handleAddComment}
        />
      )}
      {isEditModalOpen && (
        <div
          className={styles.modalOverlay}
          onClick={() => setIsEditModalOpen(false)}
        >
          <div
            className={styles.editModal}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <h2>Редактировать проект</h2>
              <button
                className={styles.closeButton}
                onClick={() => setIsEditModalOpen(false)}
                disabled={isSubmittingEdit}
              >
                ✕
              </button>
            </div>

            <div className={styles.modalBody}>
              {editErrors.api && (
                <div className={styles.apiError}>{editErrors.api}</div>
              )}

              <div className={styles.formGroup}>
                <label htmlFor="editProjectName">Название проекта *</label>
                <input
                  type="text"
                  id="editProjectName"
                  name="projectName"
                  value={editProjectData.projectName}
                  onChange={handleEditInputChange}
                  placeholder="Введите название проекта"
                  className={editErrors.projectName ? styles.inputError : ""}
                  disabled={isSubmittingEdit}
                />
                {editErrors.projectName && (
                  <span className={styles.errorText}>
                    {editErrors.projectName}
                  </span>
                )}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="editProjectDescription">Описание *</label>
                <textarea
                  id="editProjectDescription"
                  name="projectDescription"
                  value={editProjectData.projectDescription}
                  onChange={handleEditInputChange}
                  placeholder="Опишите проект"
                  rows="4"
                  className={
                    editErrors.projectDescription ? styles.inputError : ""
                  }
                  disabled={isSubmittingEdit}
                />
                {editErrors.projectDescription && (
                  <span className={styles.errorText}>
                    {editErrors.projectDescription}
                  </span>
                )}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="editProjectDeadline">
                  Дедлайн (необязательно)
                </label>
                <input
                  type="date"
                  id="editProjectDeadline"
                  name="deadline"
                  value={editProjectData.deadline || ""}
                  onChange={handleEditInputChange}
                  className={editErrors.deadline ? styles.inputError : ""}
                  disabled={isSubmittingEdit}
                />
                {editErrors.deadline && (
                  <span className={styles.errorText}>
                    {editErrors.deadline}
                  </span>
                )}
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button
                className={styles.cancelButton}
                onClick={() => setIsEditModalOpen(false)}
                disabled={isSubmittingEdit}
              >
                Отмена
              </button>
              <button
                className={styles.saveButton}
                onClick={handleSaveProject}
                disabled={isSubmittingEdit}
              >
                {isSubmittingEdit ? "Сохранение..." : "Сохранить изменения"}
              </button>
            </div>
          </div>
        </div>
      )}
      {isProjectInfoOpen && (
        <div className={styles.modalOverlay} onClick={handleCloseProjectInfo}>
          <div
            className={styles.projectModal}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <h2>Информация о проекте</h2>
              <button
                className={styles.closeButton}
                onClick={handleCloseProjectInfo}
              >
                ✕
              </button>
            </div>

            <div className={styles.modalBody}>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Название:</span>
                <span className={styles.infoValue}>
                  {projectName || "Разработка мобильного приложения"}
                </span>
              </div>

              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Описание:</span>
                <div className={styles.infoDescription}>
                  {projectDescription ||
                    "Создание кроссплатформенного приложения для управления задачами с синхронизацией в реальном времени. " +
                      "Проект включает разработку frontend и backend частей, интеграцию с внешними API и создание системы уведомлений."}
                </div>
              </div>

              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Дедлайн:</span>
                <span className={styles.infoValue}>
                  {projectDeadline
                    ? formatDate(projectDeadline)
                    : "Не установлен"}
                </span>
              </div>

              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Email владельца:</span>
                <span className={styles.infoValue}>
                  {projectOwnerEmail || "Не установлен"}
                </span>
              </div>

              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Дата создания:</span>
                <span className={styles.infoValue}>
                  {projectCreatedDate
                    ? formatDate(projectCreatedDate)
                    : "Нет редактирований"}
                </span>
              </div>

              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Дата редакт. :</span>
                <span className={styles.infoValue}>
                  {formatDate(projectUpdatedDate)}
                </span>
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button
                className={styles.closeModalButton}
                onClick={handleCloseProjectInfo}
              >
                Закрыть
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Модальное окно редактирования задачи (БЕЗ комментариев) */}
      {isModalOpen && (
        <TaskModal
          task={selectedTask}
          onSave={handleSaveTask}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedTask(null);
          }}
        />
      )}
      {/* Модальное окно добавления пользователя */}
      {isAddUserModalOpen && (
        <div
          className={styles.modalOverlay}
          onClick={() => setIsAddUserModalOpen(false)}
        >
          <div
            className={styles.addUserModal}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <h2>Пригласить участника</h2>
              <button
                className={styles.closeButton}
                onClick={() => setIsAddUserModalOpen(false)}
                disabled={isAddingUser}
              >
                ✕
              </button>
            </div>

            <div className={styles.modalBody}>
              {addUserErrors.api && (
                <div className={styles.apiError}>{addUserErrors.api}</div>
              )}

              <div className={styles.formGroup}>
                <label htmlFor="userEmail">Email участника *</label>
                <input
                  type="email"
                  id="userEmail"
                  name="email"
                  value={newUserData.email}
                  onChange={handleNewUserInputChange}
                  placeholder="example@email.com"
                  className={addUserErrors.email ? styles.inputError : ""}
                  disabled={isAddingUser}
                />
                {addUserErrors.email && (
                  <span className={styles.errorText}>
                    {addUserErrors.email}
                  </span>
                )}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="userRole">Роль в проекте *</label>
                <select
                  id="userRole"
                  name="userRole"
                  value={newUserData.userRole}
                  onChange={handleNewUserInputChange}
                  className={addUserErrors.userRole ? styles.inputError : ""}
                  disabled={isAddingUser}
                >
                  <option value="ROLE_PLANNER">Планнер</option>
                  <option value="ROLE_REVIEWER">Ревьюер</option>
                  <option value="ROLE_STUDENT">Студент</option>
                  <option value="ROLE_VIEWER">Гость</option>
                </select>
                {addUserErrors.userRole && (
                  <span className={styles.errorText}>
                    {addUserErrors.userRole}
                  </span>
                )}
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button
                className={styles.cancelButton}
                onClick={() => setIsAddUserModalOpen(false)}
                disabled={isAddingUser}
              >
                Отмена
              </button>
              <button
                className={styles.saveButton}
                onClick={handleAddUser}
                disabled={isAddingUser}
              >
                {isAddingUser ? "Добавление..." : "Добавить"}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Модальное окно подтверждения удаления пользователя */}
      {userToDelete && (
        <div
          className={styles.modalOverlay}
          onClick={() => setUserToDelete(null)}
        >
          <div
            className={styles.confirmModal}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <h2>Подтверждение удаления</h2>
              <button
                className={styles.closeButton}
                onClick={() => setUserToDelete(null)}
              >
                ✕
              </button>
            </div>

            <div className={styles.modalBody}>
              <p>
                Вы уверены, что хотите удалить пользователя{" "}
                <strong>{userToDelete.email}</strong> из проекта?
              </p>
              <p className={styles.warningText}>
                Это действие нельзя отменить.
              </p>
            </div>

            <div className={styles.modalFooter}>
              <button
                className={styles.cancelButton}
                onClick={() => setUserToDelete(null)}
              >
                Отмена
              </button>
              <button
                className={styles.deleteConfirmButton}
                onClick={handleConfirmDeleteUser}
              >
                Удалить
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Модальное окно изменения роли пользователя */}
      {userToEditRole && (
        <div
          className={styles.modalOverlay}
          onClick={() => setUserToEditRole(null)}
        >
          <div
            className={styles.editRoleModal}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <h2>Изменение роли</h2>
              <button
                className={styles.closeButton}
                onClick={() => setUserToEditRole(null)}
              >
                ✕
              </button>
            </div>

            <div className={styles.modalBody}>
              <p>
                Изменить роль для пользователя:{" "}
                <strong>{userToEditRole.username}</strong>
              </p>

              <div className={styles.formGroup}>
                <label htmlFor="newRole">Новая роль</label>
                <select
                  id="newRole"
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className={styles.roleSelect}
                >
                  <option value="ROLE_PLANNER">Планнер</option>
                  <option value="ROLE_REVIEWER">Ревьюер</option>
                  <option value="ROLE_STUDENT">Студент</option>
                  <option value="ROLE_VIEWER">Гость</option>
                </select>
              </div>

              <div className={styles.currentRoleInfo}>
                Текущая роль:{" "}
                <span
                  className={styles.currentRole}
                  style={{ backgroundColor: getRoleColor(userToEditRole.role) }}
                >
                  {getRoleString(userToEditRole.role)}
                </span>
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button
                className={styles.cancelButton}
                onClick={() => setUserToEditRole(null)}
              >
                Отмена
              </button>
              <button
                className={styles.saveButton}
                onClick={handleConfirmEditRole}
                disabled={!selectedRole || selectedRole === userToEditRole.role}
              >
                Сохранить изменения
              </button>
            </div>
          </div>
        </div>
      )}
      {isTaskStatusModalOpen && selectedTask && (
        <TaskStatusModal
          task={selectedTask}
          onClose={() => {
            setIsTaskStatusModalOpen(false);
            setSelectedTask(null);
          }}
          onStatusChange={handleStatusUpdate}
          apiAddress={apiAddress}
          projectId={projectId}
        />
      )}
      {isReviewerStatusModalOpen && selectedTask && (
        <ReviewerStatusModal
          task={selectedTask}
          onClose={() => {
            setIsReviewerStatusModalOpen(false);
            setSelectedTask(null);
          }}
          onStatusChange={handleStatusUpdate}
          apiAddress={apiAddress}
          projectId={projectId}
        />
      )}
      {isAssignModalOpen && selectedTask && (
        <TaskAssignModal
          task={selectedTask}
          projectId={projectId}
          apiAddress={apiAddress}
          onClose={() => {
            setIsAssignModalOpen(false);
            setSelectedTask(null);
          }}
          onAssignChange={handleStatusUpdate}
        />
      )}
    </div>
  );
};

const generateMockTasks = () => [
  {
    id: "1",
    title: "Разработка нового функционала",
    description: "Основная задача проекта",
    startDate: "2024-01-01",
    endDate: "2024-01-31",
    status: "In process",
    reviewerStatus: "Rejected",
    children: [
      {
        id: "2",
        title: "Проектирование архитектуры",
        description: "Создание технического задания",
        startDate: "2024-01-01",
        endDate: "2024-01-07",
        status: "Planned",
        reviewerStatus: "Accepted",
        children: [
          {
            id: "3",
            title: "Анализ требований",
            description: "Сбор и анализ требований заказчика",
            startDate: "2024-01-01",
            endDate: "2024-01-03",
            status: "Completed",
            reviewerStatus: "Accepted",
          },
        ],
      },
      {
        id: "4",
        title: "Фронтенд разработка",
        description: "Разработка пользовательского интерфейса",
        startDate: "2024-01-08",
        endDate: "2024-01-20",
        status: "In process",
        reviewerStatus: "None",
      },
      {
        id: "5",
        title: "Задача с проблемами",
        description: "Задача требующая внимания",
        startDate: "2024-01-10",
        endDate: "2024-01-15",
        status: "Delayed",
        reviewerStatus: "Rejected",
      },
    ],
  },
];

export default Project;
