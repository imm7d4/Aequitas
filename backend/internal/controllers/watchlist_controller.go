package controllers

import (
	"encoding/json"
	"net/http"

	"aequitas/internal/middleware"
	"aequitas/internal/services"
	"aequitas/internal/utils"

	"github.com/gorilla/mux"
)

type WatchlistController struct {
	service *services.WatchlistService
}

func NewWatchlistController(service *services.WatchlistService) *WatchlistController {
	return &WatchlistController{service: service}
}

func (c *WatchlistController) CreateWatchlist(w http.ResponseWriter, r *http.Request) {
	userID := middleware.GetUserID(r)

	var req struct {
		Name string `json:"name"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.RespondError(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	if req.Name == "" {
		utils.RespondError(w, http.StatusBadRequest, "Watchlist name is required")
		return
	}

	watchlist, err := c.service.CreateWatchlist(userID, req.Name)
	if err != nil {
		utils.RespondError(w, http.StatusBadRequest, err.Error())
		return
	}

	utils.RespondJSON(w, http.StatusCreated, watchlist, "Watchlist created")
}

func (c *WatchlistController) GetUserWatchlists(w http.ResponseWriter, r *http.Request) {
	userID := middleware.GetUserID(r)

	watchlists, err := c.service.GetUserWatchlists(userID)
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, err.Error())
		return
	}

	utils.RespondJSON(w, http.StatusOK, watchlists, "Watchlists retrieved")
}

func (c *WatchlistController) AddToWatchlist(w http.ResponseWriter, r *http.Request) {
	userID := middleware.GetUserID(r)
	vars := mux.Vars(r)
	watchlistID := vars["id"]
	instrumentID := vars["instrumentId"]

	err := c.service.AddToWatchlist(userID, watchlistID, instrumentID)
	if err != nil {
		utils.RespondError(w, http.StatusBadRequest, err.Error())
		return
	}

	utils.RespondJSON(w, http.StatusOK, nil, "Instrument added to watchlist")
}

func (c *WatchlistController) RemoveFromWatchlist(w http.ResponseWriter, r *http.Request) {
	userID := middleware.GetUserID(r)
	vars := mux.Vars(r)
	watchlistID := vars["id"]
	instrumentID := vars["instrumentId"]

	err := c.service.RemoveFromWatchlist(userID, watchlistID, instrumentID)
	if err != nil {
		utils.RespondError(w, http.StatusBadRequest, err.Error())
		return
	}

	utils.RespondJSON(w, http.StatusOK, nil, "Instrument removed from watchlist")
}

func (c *WatchlistController) RenameWatchlist(w http.ResponseWriter, r *http.Request) {
	userID := middleware.GetUserID(r)
	vars := mux.Vars(r)
	watchlistID := vars["id"]

	var req struct {
		Name string `json:"name"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.RespondError(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	err := c.service.RenameWatchlist(userID, watchlistID, req.Name)
	if err != nil {
		utils.RespondError(w, http.StatusBadRequest, err.Error())
		return
	}

	utils.RespondJSON(w, http.StatusOK, nil, "Watchlist renamed")
}

func (c *WatchlistController) SetDefaultWatchlist(w http.ResponseWriter, r *http.Request) {
	userID := middleware.GetUserID(r)
	vars := mux.Vars(r)
	watchlistID := vars["id"]

	err := c.service.SetDefaultWatchlist(userID, watchlistID)
	if err != nil {
		utils.RespondError(w, http.StatusBadRequest, err.Error())
		return
	}

	utils.RespondJSON(w, http.StatusOK, nil, "Default watchlist updated")
}

func (c *WatchlistController) DeleteWatchlist(w http.ResponseWriter, r *http.Request) {
	userID := middleware.GetUserID(r)
	vars := mux.Vars(r)
	watchlistID := vars["id"]

	err := c.service.DeleteWatchlist(userID, watchlistID)
	if err != nil {
		utils.RespondError(w, http.StatusBadRequest, err.Error())
		return
	}

	utils.RespondJSON(w, http.StatusOK, nil, "Watchlist deleted")
}
