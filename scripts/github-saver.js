// GitHub API интеграция для сохранения изменений

class GitHubSaver {
    constructor() {
        this.owner = 'forget-ful-day';
        this.repo = 'Maximilian-Zaitsev.github.io';
        this.token = localStorage.getItem('github_token');
        this.branch = 'main';
    }

    setToken(token) {
        this.token = token;
        localStorage.setItem('github_token', token);
    }

    async getFileContent(filePath) {
        try {
            const response = await fetch(
                `https://api.github.com/repos/${this.owner}/${this.repo}/contents/${filePath}?ref=${this.branch}`,
                {
                    headers: {
                        'Authorization': `token ${this.token}`,
                        'Accept': 'application/vnd.github.v3+json'
                    }
                }
            );
            if (response.ok) {
                return await response.json();
            }
            return null;
        } catch (err) {
            console.error('Ошибка при получении файла:', err);
            return null;
        }
    }

    async updateFile(filePath, content, message) {
        try {
            const fileData = await this.getFileContent(filePath);
            const sha = fileData ? fileData.sha : undefined;

            const response = await fetch(
                `https://api.github.com/repos/${this.owner}/${this.repo}/contents/${filePath}`,
                {
                    method: 'PUT',
                    headers: {
                        'Authorization': `token ${this.token}`,
                        'Accept': 'application/vnd.github.v3+json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        message: message || `Update ${filePath}`,
                        content: btoa(unescape(encodeURIComponent(content))),
                        branch: this.branch,
                        sha: sha
                    })
                }
            );

            if (response.ok) {
                const result = await response.json();
                return { success: true, data: result };
            } else {
                const error = await response.json();
                return { success: false, error: error.message };
            }
        } catch (err) {
            return { success: false, error: err.message };
        }
    }

    async savePageToGitHub(filePath, htmlContent) {
        if (!this.token) {
            alert('⚠️ Требуется GitHub токен для сохранения.\nПожалуйста, установите токен в настройках.');
            return false;
        }

        const result = await this.updateFile(filePath, htmlContent, `Update ${filePath} via editor`);
        
        if (result.success) {
            alert(`✅ Страница успешно сохранена на GitHub!\n\nФайл: ${filePath}`);
            return true;
        } else {
            alert(`❌ Ошибка при сохранении: ${result.error}`);
            return false;
        }
    }

    async saveDataToGitHub(dataFileName, data) {
        const jsonContent = JSON.stringify(data, null, 2);
        const result = await this.updateFile(`data/${dataFileName}.json`, jsonContent, `Update ${dataFileName} data`);
        return result.success;
    }
}

// Создаём глобальный экземпляр
const githubSaver = new GitHubSaver();

// Функция для установки токена
function setupGitHubToken() {
    const token = prompt('Введите ваш GitHub Personal Access Token:\n\n(Создайте его на https://github.com/settings/tokens)');
    if (token) {
        githubSaver.setToken(token);
        alert('✅ Токен сохранён успешно!');
    }
}

// Расширяем редактор функциональностью GitHub
if (window.AdvancedPageEditor) {
    const originalSaveToGitHub = AdvancedPageEditor.prototype.saveToGitHub;
    
    AdvancedPageEditor.prototype.saveToGitHub = async function() {
        if (!githubSaver.token) {
            const setup = confirm('GitHub токен не установлен. Установить сейчас?');
            if (setup) {
                setupGitHubToken();
                return;
            }
            return;
        }

        const htmlContent = document.documentElement.outerHTML;
        const saving = confirm(`Сохранить текущую страницу (${this.currentPage}) на GitHub?`);
        
        if (saving) {
            const success = await githubSaver.savePageToGitHub(this.currentPage, htmlContent);
            
            if (success) {
                // Сохраняем данные
                await githubSaver.saveDataToGitHub('projects', this.projects);
                await githubSaver.saveDataToGitHub('achievements', this.achievements);
                await githubSaver.saveDataToGitHub('faqs', this.faqs);
                
                alert('✅ Все данные успешно синхронизированы с GitHub!');
            }
        }
    };
}
