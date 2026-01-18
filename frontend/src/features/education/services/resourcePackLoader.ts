// Resource Pack Loader Service
// Loads education modules from JSON resource packs

export interface EducationModule {
    id: string;
    title: string;
    category: string;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    estimatedTime: string;
    description: string;
    sections: ModuleSection[];
    keyTakeaways: string[];
    relatedModules: string[];
    quiz?: QuizQuestion[];
}

export interface ModuleSection {
    id: string;
    title: string;
    type: 'text' | 'flow' | 'interactive' | 'visual' | 'calculator';
    component?: string;
    content: any;
}

export interface QuizQuestion {
    question: string;
    options: string[];
    correct: number;
    explanation: string;
}

export interface ModuleCategory {
    id: string;
    title: string;
    icon: string;
    description: string;
    modules: string[];
}

export interface ModuleMetadata {
    id: string;
    title: string;
    category: string;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    estimatedTime: string;
    description: string;
    featured?: boolean;
    required?: boolean;
}

export interface ModuleIndex {
    categories: ModuleCategory[];
    modules: Record<string, ModuleMetadata>;
}

class ResourcePackLoader {
    private cache: Map<string, EducationModule> = new Map();
    private index: ModuleIndex | null = null;

    /**
     * Load the module index
     */
    async loadIndex(): Promise<ModuleIndex> {
        if (this.index) return this.index;

        try {
            const response = await import('@/data/education/index.json');
            this.index = response.default as ModuleIndex;
            return this.index;
        } catch (error) {
            console.error('Failed to load education index:', error);
            throw new Error('Failed to load education modules');
        }
    }

    /**
     * Load a specific module by ID
     */
    async loadModule(moduleId: string): Promise<EducationModule> {
        // Check cache first
        if (this.cache.has(moduleId)) {
            return this.cache.get(moduleId)!;
        }

        const index = await this.loadIndex();
        const metadata = index.modules[moduleId];

        if (!metadata) {
            throw new Error(`Module ${moduleId} not found`);
        }

        // Since we are using custom React components for all modules,
        // we only need the metadata from the index.
        const module: EducationModule = {
            ...metadata,
            sections: [],
            keyTakeaways: [],
            relatedModules: []
        };

        this.cache.set(moduleId, module);
        return module;
    }

    /**
     * Load all modules in a category
     */
    async loadCategory(categoryId: string): Promise<EducationModule[]> {
        const index = await this.loadIndex();
        const category = index.categories.find(c => c.id === categoryId);

        if (!category) {
            throw new Error(`Category ${categoryId} not found`);
        }

        const modules: EducationModule[] = [];

        for (const moduleId of category.modules) {
            try {
                const moduleData = await this.loadModule(moduleId);
                modules.push(moduleData);
            } catch (error) {
                console.warn(`Skipping missing module: ${moduleId}`);
            }
        }

        return modules;
    }

    /**
     * Search modules by query
     */
    async searchModules(query: string): Promise<EducationModule[]> {
        const index = await this.loadIndex();
        const lowerQuery = query.toLowerCase();

        const matchingModules: EducationModule[] = [];

        for (const moduleId of Object.keys(index.modules)) {
            const moduleData = index.modules[moduleId];
            if (
                moduleData.title.toLowerCase().includes(lowerQuery) ||
                moduleData.description.toLowerCase().includes(lowerQuery)
            ) {
                matchingModules.push(await this.loadModule(moduleId));
            }
        }

        return matchingModules;
    }

    /**
     * Get module progress (from localStorage)
     */
    getProgress(moduleId: string): number {
        const progress = localStorage.getItem(`education-progress-${moduleId}`);
        return progress ? parseInt(progress, 10) : 0;
    }

    /**
     * Save module progress
     */
    saveProgress(moduleId: string, progress: number): void {
        localStorage.setItem(`education-progress-${moduleId}`, progress.toString());
    }

    /**
     * Mark module as completed
     */
    markComplete(moduleId: string): void {
        this.saveProgress(moduleId, 100);
        const completed = this.getCompletedModules();
        if (!completed.includes(moduleId)) {
            completed.push(moduleId);
            localStorage.setItem('education-completed', JSON.stringify(completed));
        }
    }

    /**
     * Get list of completed modules
     */
    getCompletedModules(): string[] {
        const completed = localStorage.getItem('education-completed');
        return completed ? JSON.parse(completed) : [];
    }

    /**
     * Clear cache (for development)
     */
    clearCache(): void {
        this.cache.clear();
        this.index = null;
    }
}

// Export singleton instance
export const resourcePackLoader = new ResourcePackLoader();
