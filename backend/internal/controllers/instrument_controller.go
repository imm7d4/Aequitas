package controllers

import (
	"aequitas/internal/middleware"
	"aequitas/internal/services"
	"aequitas/internal/utils"
	"encoding/json"
	"net/http"

	"github.com/gorilla/mux"
)

type InstrumentController struct {
	service *services.InstrumentService
}

func NewInstrumentController(
	service *services.InstrumentService,
) *InstrumentController {
	return &InstrumentController{service: service}
}

func (c *InstrumentController) CreateInstrument(
	w http.ResponseWriter,
	r *http.Request,
) {
	var req services.CreateInstrumentRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.RespondError(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	instrument, err := c.service.CreateInstrument(req)
	if err != nil {
		utils.RespondError(w, http.StatusBadRequest, err.Error())
		return
	}

	utils.RespondJSON(w, http.StatusCreated, instrument, "Instrument created")
}

func (c *InstrumentController) GetInstruments(
	w http.ResponseWriter,
	r *http.Request,
) {
	isAdmin, _ := r.Context().Value(middleware.IsAdminKey).(bool)

	instruments, err := c.service.GetInstruments(isAdmin)
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, err.Error())
		return
	}

	utils.RespondJSON(w, http.StatusOK, instruments, "Instruments retrieved")
}

func (c *InstrumentController) GetInstrumentByID(
	w http.ResponseWriter,
	r *http.Request,
) {
	vars := mux.Vars(r)
	id := vars["id"]

	instrument, err := c.service.GetInstrumentByID(id)
	if err != nil {
		utils.RespondError(w, http.StatusNotFound, err.Error())
		return
	}

	utils.RespondJSON(w, http.StatusOK, instrument, "Instrument retrieved")
}

func (c *InstrumentController) SearchInstruments(
	w http.ResponseWriter,
	r *http.Request,
) {
	query := r.URL.Query().Get("q")

	instruments, err := c.service.SearchInstruments(query)
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, err.Error())
		return
	}

	utils.RespondJSON(w, http.StatusOK, instruments, "Search results")
}

func (c *InstrumentController) UpdateInstrument(
	w http.ResponseWriter,
	r *http.Request,
) {
	vars := mux.Vars(r)
	id := vars["id"]

	var req services.UpdateInstrumentRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.RespondError(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	instrument, err := c.service.UpdateInstrument(id, req)
	if err != nil {
		utils.RespondError(w, http.StatusBadRequest, err.Error())
		return
	}

	utils.RespondJSON(w, http.StatusOK, instrument, "Instrument updated")
}
