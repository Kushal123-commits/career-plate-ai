import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { CareerRole, ExperienceLevel } from '../types';
import { X, Save, Plus, Check } from 'lucide-react';

export const ProfileModal: React.FC = () => {
  const { user, profileModalOpen, closeProfileModal, updateProfile } = useAuth();

  if (!profileModalOpen || !user) return null;

  const [name, setName] = useState(user.name);
  const [targetCareer, setTargetCareer] = useState<CareerRole>(user.targetCareer);
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel>(user.experienceLevel);
  const [bio, setBio] = useState(user.bio);
  const [skills, setSkills] = useState<string[]>([...user.skills]);
  const [newSkillInput, setNewSkillInput] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const careers: CareerRole[] = [
    'Software Developer',
    'Full Stack Developer',
    'Frontend Developer',
    'Backend Developer',
    'Data Scientist',
    'AI/ML Engineer',
    'Cybersecurity Engineer',
    'Cloud Engineer',
    'DevOps Engineer',
  ];

  const levels: ExperienceLevel[] = ['Student', 'Junior', 'Mid-Level', 'Senior'];

  const handleAddSkill = () => {
    const trimmed = newSkillInput.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills([...skills, trimmed]);
      setNewSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name,
      targetCareer,
      experienceLevel,
      bio,
      skills,
    });
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      closeProfileModal();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8 text-slate-100">
        
        {/* Close Button */}
        <button
          onClick={closeProfileModal}
          className="absolute top-4 right-4 p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-4 mb-6">
          <img
            src={user.avatarUrl || '/src/assets/images/avatar_career_user_1793351203372.jpg'}
            alt={user.name}
            referrerPolicy="no-referrer"
            className="w-14 h-14 rounded-full object-cover border-2 border-blue-500 shadow-lg shadow-blue-500/20"
          />
          <div>
            <h3 className="text-xl font-bold text-white tracking-tight">Your Career Profile</h3>
            <p className="text-xs text-slate-400">{user.email}</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Experience Level</label>
              <select
                value={experienceLevel}
                onChange={e => setExperienceLevel(e.target.value as ExperienceLevel)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500"
              >
                {levels.map(lvl => (
                  <option key={lvl} value={lvl}>
                    {lvl}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Target Tech Career</label>
            <select
              value={targetCareer}
              onChange={e => setTargetCareer(e.target.value as CareerRole)}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500"
            >
              {careers.map(c => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Bio & Aspirations</label>
            <textarea
              rows={3}
              value={bio}
              onChange={e => setBio(e.target.value)}
              placeholder="Tell hiring managers and AI about your background and goals..."
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500 resize-none"
            />
          </div>

          {/* Verified Skills Manager */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Your Current Technical Skills ({skills.length})
            </label>
            <div className="flex gap-2 mb-2.5">
              <input
                type="text"
                value={newSkillInput}
                onChange={e => setNewSkillInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSkill();
                  }
                }}
                placeholder="e.g. Next.js, Redis, PyTorch..."
                className="flex-1 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 transition-colors flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                Add
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-2 rounded-lg bg-slate-950 border border-slate-800/80">
              {skills.map(skill => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-xs text-slate-200"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="text-slate-500 hover:text-red-400 transition-colors"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={closeProfileModal}
              className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs transition-colors shadow-md shadow-blue-500/20"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5 text-white" />
                  Saved!
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
