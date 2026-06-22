import React, { useState, useEffect } from 'react';
import { useProgress } from '../hooks/useProgress';

const DEFAULT_POSTS = [
  {
    id: 'announcement-1',
    author: {
      name: 'Formateur SU',
      role: 'Équipe Secret Union',
      avatar: '',
      isAdmin: true,
    },
    title: '🏛️ BIENVENUE CHEZ SECRET UNION — À lire en premier !',
    content: 'Félicitations pour avoir rejoint l\'Union. Ce Skool a été conçu pour t\'apprendre à maîtriser la création virale, l\'affiliation et l\'intégration de l\'IA dans tes business de contenu. Commence par le module "INTRO". Applique les méthodes chaque jour, crée ta Secret Page et n\'hésite pas à poser tes questions dans l\'onglet Communauté. Let\'s make it viral ! 🔥',
    category: 'Annonces',
    likes: 42,
    likedByUser: false,
    comments: [
      { author: 'Thomas', text: 'C\'est parti ! Le contenu est incroyable.' },
      { author: 'Lucas', text: 'Prêt à travailler dur pour monter mes Secret Pages.' }
    ],
    createdAt: 'Il y a 2 heures',
  },
  {
    id: 'post-1',
    author: {
      name: 'Lucas B.',
      role: 'Créateur Level 3',
      avatar: '',
      isAdmin: false,
    },
    title: 'Feedback sur mon script vidéo TikTok (Accroche IA)',
    content: 'Salut l\'équipe ! J\'ai rédigé ce script pour ma niche de développement personnel, en essayant d\'utiliser la structure virale en 3 étapes. J\'ai un doute sur l\'accroche (le hook) : "L\'erreur à 99% que tu commets tous les matins sans le savoir...". Est-ce qu\'elle suscite assez de curiosité à votre avis ?',
    category: 'Création',
    likes: 18,
    likedByUser: false,
    comments: [
      { author: 'Formateur SU', text: 'C\'est une très bonne base ! Pour l\'optimiser, tu peux ajouter une négation ou un chiffre précis, par exemple : "L\'erreur à 99% qui ruine ta productivité avant 9h du matin...". Ça engage encore plus.' }
    ],
    createdAt: 'Il y a 5 heures',
  },
  {
    id: 'post-2',
    author: {
      name: 'Thomas D.',
      role: 'Créateur Level 1',
      avatar: '',
      isAdmin: false,
    },
    title: 'Problème de voix-off sur ElevenLabs',
    content: 'Est-ce que d\'autres personnes ont des problèmes de variations d\'intonation avec ElevenLabs ? Ma voix devient parfois robotique vers la fin du texte ou s\'accélère d\'un coup sans raison.',
    category: 'Questions',
    likes: 9,
    likedByUser: false,
    comments: [
      { author: 'David', text: 'Regarde la vidéo 06 du module AI Secret System, j\'ai listé les paramètres de stabilité à ajuster (augmente la stabilité à 75% pour éviter les dérives de ton).' }
    ],
    createdAt: 'Il y a 1 jour',
  },
  {
    id: 'post-3',
    author: {
      name: 'David K.',
      role: 'Créateur Level 4',
      avatar: '',
      isAdmin: false,
    },
    title: '🏆 100K abonnés sur ma Secret Page !',
    content: 'Je viens de passer la barre des 100 000 abonnés sur mon compte Instagram en moins de 30 jours ! La stratégie de niche et les scripts générés par l\'IA du module Secret System ont marché à merveille. Merci pour vos retours !',
    category: 'Motivation',
    likes: 56,
    likedByUser: false,
    comments: [
      { author: 'Formateur SU', text: 'Incroyable performance David ! Très fier de ton évolution. C\'est la preuve que la méthode fonctionne quand on l\'applique rigoureusement 🏆' },
      { author: 'Thomas', text: 'Quelle ligne de croissance de fou ! Félicitations.' }
    ],
    createdAt: 'Il y a 2 jours',
  }
];

const CATEGORIES = ['Tout', 'Annonces', 'Création', 'Questions', 'Motivation'];

export function CommunityPage({ contentMap }) {
  const { progress } = useProgress();
  const [posts, setPosts] = useState(() => {
    try {
      const saved = localStorage.getItem('pe-skool-posts');
      return saved ? JSON.parse(saved) : DEFAULT_POSTS;
    } catch {
      return DEFAULT_POSTS;
    }
  });

  const [activeCategory, setActiveCategory] = useState('Tout');
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState('Physique');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [commentInputs, setCommentInputs] = useState({});

  useEffect(() => {
    try {
      localStorage.setItem('pe-skool-posts', JSON.stringify(posts));
    } catch (err) {
      console.error('Error saving posts to localStorage', err);
    }
  }, [posts]);

  // Handle post creation
  const handleCreatePost = (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const newPost = {
      id: `custom-${Date.now()}`,
      author: {
        name: 'Membre',
        role: 'Membre Officiel',
        avatar: '',
        isAdmin: false,
      },
      title: newTitle,
      content: newContent,
      category: newCategory,
      likes: 0,
      likedByUser: false,
      comments: [],
      createdAt: 'À l\'instant',
    };

    setPosts([newPost, ...posts]);
    setNewTitle('');
    setNewContent('');
    setShowCreateModal(false);
  };

  // Like toggle
  const handleLike = (postId) => {
    setPosts(
      posts.map((post) => {
        if (post.id === postId) {
          const liked = !post.likedByUser;
          return {
            ...post,
            likedByUser: liked,
            likes: liked ? post.likes + 1 : post.likes - 1,
          };
        }
        return post;
      })
    );
  };

  // Handle comment submit
  const handleAddComment = (postId, e) => {
    e.preventDefault();
    const commentText = commentInputs[postId] || '';
    if (!commentText.trim()) return;

    setPosts(
      posts.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            comments: [...post.comments, { author: 'Membre', text: commentText }],
          };
        }
        return post;
      })
    );

    setCommentInputs({
      ...commentInputs,
      [postId]: '',
    });
  };

  // Filter posts
  const filteredPosts = activeCategory === 'Tout'
    ? posts
    : posts.filter(post => post.category === activeCategory);

  return (
    <div className="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        
        {/* Left Column: Categories List */}
        <div className="lg:col-span-1">
          <div className="glass-card border border-border-subtle bg-bg-card p-4 space-y-1 sticky top-24">
            <h3 className="text-xs font-black text-white font-display uppercase tracking-widest px-3 mb-3">
              Catégories
            </h3>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`w-full text-left rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${
                  activeCategory === cat
                    ? 'bg-gold-500/10 text-gold-300 font-bold border-l-2 border-gold-500 pl-3'
                    : 'text-text-secondary hover:text-white hover:bg-bg-card-hover border-l-2 border-transparent'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Center Column: Feed */}
        <div className="lg:col-span-2 space-y-6">
          {/* Create Post Header Trigger */}
          <div
            onClick={() => setShowCreateModal(true)}
            className="glass-card border border-border-subtle bg-bg-card/50 p-4 flex items-center gap-3 cursor-pointer hover:bg-bg-card-hover transition-colors"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gold-500/20 bg-bg-primary text-gold-500 font-bold">
              AP
            </div>
            <div className="flex-1 rounded-full border border-border-white bg-bg-input px-4 py-2 text-sm text-text-muted">
              Qu'avez-vous en tête ?
            </div>
            <button className="btn-primary-gold !py-2 !px-4 !min-height-0 !text-xs">
              Publier
            </button>
          </div>

          {/* Posts List */}
          <div className="space-y-6">
            {filteredPosts.map((post) => (
              <article
                key={post.id}
                className="glass-card border border-border-subtle bg-bg-card p-6 space-y-4"
              >
                {/* Author Metadata */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {post.author.avatar ? (
                      <img
                        src={post.author.avatar}
                        alt=""
                        className="h-10 w-10 rounded-full border border-gold-500/20 object-cover"
                      />
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-full border border-gold-500/20 bg-bg-primary text-gold-400 font-bold text-sm">
                        {post.author.name[0]}
                      </div>
                    )}
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-white flex items-center gap-1.5">
                        {post.author.name}
                        {post.author.isAdmin && (
                          <span className="text-[9px] uppercase tracking-wider font-extrabold px-1.5 py-0.5 rounded border border-gold-500/30 text-gold-400 bg-gold-950/40">
                            Coach
                          </span>
                        )}
                      </span>
                      <span className="text-[10px] text-text-muted font-body">
                        {post.author.role} • {post.createdAt}
                      </span>
                    </div>
                  </div>

                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded border border-border-white text-text-secondary">
                    {post.category}
                  </span>
                </div>

                {/* Content */}
                <div className="space-y-2">
                  <h2 className="text-base font-extrabold text-white font-display">
                    {post.title}
                  </h2>
                  <p className="text-sm text-text-secondary font-body font-light leading-relaxed whitespace-pre-line">
                    {post.content}
                  </p>
                </div>

                {/* Engagement counts */}
                <div className="flex items-center gap-6 border-t border-b border-border-white py-3">
                  <button
                    onClick={() => handleLike(post.id)}
                    className={`flex items-center gap-2 text-xs font-semibold transition-colors ${
                      post.likedByUser
                        ? 'text-gold-400'
                        : 'text-text-secondary hover:text-white'
                    }`}
                  >
                    <svg className="h-4 w-4" fill={post.likedByUser ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    <span>{post.likes}</span>
                  </button>

                  <div className="flex items-center gap-2 text-xs text-text-secondary">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <span>{post.comments.length} commentaires</span>
                  </div>
                </div>

                {/* Comment Section */}
                {post.comments.length > 0 && (
                  <div className="space-y-3 pl-4 border-l border-border-white">
                    {post.comments.map((comment, idx) => (
                      <div key={idx} className="text-xs">
                        <span className="font-bold text-white mr-1.5">{comment.author}</span>
                        <span className="text-text-secondary font-body font-light">{comment.text}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Comment Input */}
                <form
                  onSubmit={(e) => handleAddComment(post.id, e)}
                  className="flex gap-2"
                >
                  <input
                    type="text"
                    placeholder="Écrire un commentaire..."
                    value={commentInputs[post.id] || ''}
                    onChange={(e) =>
                      setCommentInputs({
                        ...commentInputs,
                        [post.id]: e.target.value,
                      })
                    }
                    className="flex-1 rounded-full border border-border-white bg-bg-input px-4 py-1.5 text-xs text-text-primary placeholder-text-muted outline-none focus:border-border-active"
                  />
                  <button
                    type="submit"
                    className="rounded-full bg-border-white hover:bg-gold-500/20 hover:text-gold-300 border border-transparent px-4 py-1 text-xs font-semibold text-text-primary transition-all"
                  >
                    Envoyer
                  </button>
                </form>
              </article>
            ))}
          </div>
        </div>

        {/* Right Column: Community Info Card */}
        <div className="lg:col-span-1 space-y-6">
          {/* About group widget */}
          <div className="glass-card border border-border-subtle bg-bg-card p-6 space-y-4">
            <h3 className="text-sm font-black text-white font-display uppercase tracking-widest">
              À propos de l'Union
            </h3>
            <p className="text-xs text-text-secondary font-body leading-relaxed">
              Le premier groupe offline dédié exclusivement aux secrets de la création de contenu viral, de l'affiliation et de l'intelligence artificielle.
            </p>
            <div className="pt-4 border-t border-border-white flex items-center justify-between text-xs text-text-muted">
              <span>Créateur</span>
              <span className="font-bold text-white">Formateur SU</span>
            </div>
            <div className="flex items-center justify-between text-xs text-text-muted">
              <span>Membres actifs</span>
              <span className="font-bold text-white">524 créateurs</span>
            </div>
          </div>

          {/* Active members widget */}
          <div className="glass-card border border-border-subtle bg-bg-card p-6 space-y-4">
            <h3 className="text-sm font-black text-white font-display uppercase tracking-widest">
              Créateurs en ligne
            </h3>
            <div className="flex flex-wrap gap-2">
              {['Lucas', 'Thomas', 'David', 'Alexandre', 'Nico', 'Max', 'Julien'].map((name, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-1.5 rounded-full border border-border-white bg-bg-primary/50 px-2.5 py-1 text-[10px] font-semibold text-text-secondary"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-success" />
                  {name}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Post Creation Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-bg-overlay p-4 backdrop-blur-sm">
          <div className="glass-card border border-border-active bg-bg-card max-w-lg w-full p-6 space-y-4 shadow-2xl relative">
            <button
              onClick={() => setShowCreateModal(false)}
              className="absolute top-4 right-4 text-text-muted hover:text-white"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h3 className="text-lg font-black text-white font-display">
              Créer une nouvelle publication
            </h3>

            <form onSubmit={handleCreatePost} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-text-secondary uppercase">
                  Titre du post
                </label>
                <input
                  type="text"
                  placeholder="De quoi parlez-vous ?"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required
                  className="w-full rounded-xl border border-border-white bg-bg-input px-4 py-2.5 text-sm text-text-primary outline-none focus:border-border-active"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-text-secondary uppercase">
                    Catégorie
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full rounded-xl border border-border-white bg-bg-input px-4 py-2.5 text-sm text-text-primary outline-none focus:border-border-active"
                  >
                    {CATEGORIES.slice(1).map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-text-secondary uppercase">
                  Contenu
                </label>
                <textarea
                  placeholder="Racontez-nous..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  required
                  rows="4"
                  className="w-full rounded-xl border border-border-white bg-bg-input px-4 py-2.5 text-sm text-text-primary outline-none focus:border-border-active resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="rounded-full border border-border-hover hover:border-gold-500/50 hover:bg-gold-500/10 px-5 py-2 text-xs font-semibold text-text-primary transition-all"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="btn-primary-gold !py-2 !px-6 !min-height-0 !text-xs"
                >
                  Publier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default CommunityPage;
