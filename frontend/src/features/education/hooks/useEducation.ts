import { useState, useEffect } from 'react';
import { resourcePackLoader, EducationModule, ModuleIndex } from '../services/resourcePackLoader';

/**
 * Hook to load the education module index
 */
export function useEducationIndex() {
    const [index, setIndex] = useState<ModuleIndex | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadIndex();
    }, []);

    const loadIndex = async () => {
        try {
            setLoading(true);
            const data = await resourcePackLoader.loadIndex();
            setIndex(data);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load index');
        } finally {
            setLoading(false);
        }
    };

    return { index, loading, error, reload: loadIndex };
}

/**
 * Hook to load a specific module
 */
export function useEducationModule(moduleId: string | null) {
    const [module, setModule] = useState<EducationModule | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        if (moduleId) {
            loadModule(moduleId);
        }
    }, [moduleId]);

    const loadModule = async (id: string) => {
        try {
            setLoading(true);
            const data = await resourcePackLoader.loadModule(id);
            setModule(data);
            setProgress(resourcePackLoader.getProgress(id));
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load module');
        } finally {
            setLoading(false);
        }
    };

    const updateProgress = (newProgress: number) => {
        if (moduleId) {
            resourcePackLoader.saveProgress(moduleId, newProgress);
            setProgress(newProgress);
        }
    };

    const markComplete = () => {
        if (moduleId) {
            resourcePackLoader.markComplete(moduleId);
            setProgress(100);
        }
    };

    return { module, loading, error, progress, updateProgress, markComplete };
}

/**
 * Hook to load modules by category
 */
export function useEducationCategory(categoryId: string | null) {
    const [modules, setModules] = useState<EducationModule[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (categoryId) {
            loadCategory(categoryId);
        }
    }, [categoryId]);

    const loadCategory = async (id: string) => {
        try {
            setLoading(true);
            const data = await resourcePackLoader.loadCategory(id);
            setModules(data);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load category');
        } finally {
            setLoading(false);
        }
    };

    return { modules, loading, error };
}

/**
 * Hook for module search
 */
export function useEducationSearch() {
    const [results, setResults] = useState<EducationModule[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const search = async (query: string) => {
        if (!query.trim()) {
            setResults([]);
            return;
        }

        try {
            setLoading(true);
            const data = await resourcePackLoader.searchModules(query);
            setResults(data);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Search failed');
        } finally {
            setLoading(false);
        }
    };

    const clearResults = () => {
        setResults([]);
    };

    return { results, loading, error, search, clearResults };
}

/**
 * Hook to track overall progress
 */
export function useEducationProgress() {
    const [completedModules, setCompletedModules] = useState<string[]>([]);
    const [totalModules, setTotalModules] = useState(0);

    useEffect(() => {
        loadProgress();
    }, []);

    const loadProgress = async () => {
        const completed = resourcePackLoader.getCompletedModules();
        setCompletedModules(completed);

        const index = await resourcePackLoader.loadIndex();
        setTotalModules(Object.keys(index.modules).length);
    };

    const completionPercentage = totalModules > 0
        ? Math.round((completedModules.length / totalModules) * 100)
        : 0;

    return {
        completedModules,
        totalModules,
        completionPercentage,
        reload: loadProgress,
    };
}
