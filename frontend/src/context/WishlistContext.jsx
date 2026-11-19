import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../api/client';
import { useAuth } from './AuthContext';
import { useNotification } from './NotificationContext';

const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
  const { isAuthenticated, openAuthModal } = useAuth();
  const { notifySuccess, notifyInfo, notifyError } = useNotification();
  const [wishlistIds, setWishlistIds] = useState(new Set());
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchWishlist = useCallback(async () => {
    if (!isAuthenticated) {
      setWishlistIds(new Set());
      setWishlistItems([]);
      return;
    }
    setLoading(true);
    try {
      const res = await api.wishlist.getAll();
      if (res.success && res.data) {
        setWishlistItems(res.data.properties || []);
        setWishlistIds(new Set(res.data.wishlist_ids?.map(Number) || []));
      }
    } catch (err) {
      console.warn('Error fetching wishlist:', err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const toggleWishlist = async (property) => {
    if (!isAuthenticated) {
      notifyInfo('Please sign in to save PGs to your shortlist');
      openAuthModal('login');
      return;
    }

    const propId = Number(property.id);
    const wasIn = wishlistIds.has(propId);

    // Optimistic UI update
    setWishlistIds((prev) => {
      const next = new Set(prev);
      if (wasIn) next.delete(propId);
      else next.add(propId);
      return next;
    });

    try {
      const res = await api.wishlist.toggle(propId);
      if (res.success) {
        if (res.data?.is_in_wishlist) {
          notifySuccess('Saved to your shortlist!');
          setWishlistItems((prev) => [property, ...prev.filter((p) => p.id !== propId)]);
        } else {
          notifyInfo('Removed from shortlist');
          setWishlistItems((prev) => prev.filter((p) => p.id !== propId));
        }
      }
    } catch (err) {
      // Revert optimistic update
      setWishlistIds((prev) => {
        const next = new Set(prev);
        if (wasIn) next.add(propId);
        else next.delete(propId);
        return next;
      });
      notifyError('Failed to update shortlist. Please try again.');
    }
  };

  const isInWishlist = (propertyId) => {
    return wishlistIds.has(Number(propertyId));
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistIds,
        wishlistItems,
        loading,
        toggleWishlist,
        isInWishlist,
        refreshWishlist: fetchWishlist
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
